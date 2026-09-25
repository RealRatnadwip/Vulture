import { NextRequest, NextResponse } from "next/server";
import { isAuth0Configured } from "@/lib/auth";
import { getUserByAuth0Id, upsertUser, ensureDefaultGroupMemberships } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ auth0: string[] }> }
) {
  const { auth0 } = await params;
  const action = auth0?.[0] || "login";

  // Dynamically resolve appUrl so localhost:3000 works during local dev
  // and production domains work in production
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
  const proto = req.headers.get("x-forwarded-proto") || (req.url.startsWith("https") ? "https" : "http");

  const appUrl = isLocal
    ? `http://${host}`
    : (process.env.AUTH0_BASE_URL || (host ? `${proto}://${host}` : process.env.NEXT_PUBLIC_APP_URL) || "http://localhost:3000").replace(/\/$/, "");

  // When Auth0 is NOT configured, handle demo fallbacks
  if (!isAuth0Configured()) {
    if (action === "logout") {
      const isPrefetch =
        req.headers.get("purpose") === "prefetch" ||
        req.headers.get("sec-purpose") === "prefetch" ||
        req.headers.get("next-router-prefetch") === "1" ||
        req.headers.get("x-middleware-prefetch") === "1";
      if (isPrefetch) {
        return new NextResponse(null, { status: 204 });
      }

      const response = NextResponse.redirect(new URL("/login", appUrl));
      response.cookies.delete("vulture_demo_user");
      response.cookies.delete("vulture_session");
      return response;
    }
    return NextResponse.redirect(new URL("/dashboard", appUrl));
  }

  // Auth0 credentials
  const domain = process.env.AUTH0_ISSUER_BASE_URL?.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const clientId = process.env.AUTH0_CLIENT_ID;
  const clientSecret = process.env.AUTH0_CLIENT_SECRET;
  const redirectUri = `${appUrl}/api/auth/callback`;

  // 1. LOGIN: Redirect to Auth0 Universal Login
  if (action === "login") {
    const authUrl = `https://${domain}/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=openid profile email`;
    return NextResponse.redirect(authUrl);
  }

  // 2. CALLBACK: Exchange authorization code for tokens & create session
  if (action === "callback") {
    const code = req.nextUrl.searchParams.get("code");
    const error = req.nextUrl.searchParams.get("error");
    const errorDescription = req.nextUrl.searchParams.get("error_description");

    if (error || !code) {
      console.error("[Auth0] Callback error:", error, errorDescription);
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(errorDescription || error || "auth_failed")}`, appUrl));
    }

    try {
      // Exchange code for tokens
      const tokenRes = await fetch(`https://${domain}/oauth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grant_type: "authorization_code",
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: redirectUri,
        }),
      });

      if (!tokenRes.ok) {
        const errText = await tokenRes.text();
        console.error("[Auth0] Token exchange failed:", errText);
        return NextResponse.redirect(new URL("/login?error=token_exchange_failed", appUrl));
      }

      const tokens = await tokenRes.json();

      // Fetch user profile from Auth0 /userinfo
      const userRes = await fetch(`https://${domain}/userinfo`, {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });

      if (!userRes.ok) {
        console.error("[Auth0] Failed to fetch userinfo");
        return NextResponse.redirect(new URL("/login?error=userinfo_failed", appUrl));
      }

      const profile = await userRes.json();
      const auth0Id = profile.sub; // e.g. "auth0|12345" or "google-oauth2|..."

      // Ensure user exists in Postgres database
      let user = await getUserByAuth0Id(auth0Id);
      const userId = user?.id || `usr_${auth0Id.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 36)}`;

      user = await upsertUser({
        id: userId,
        auth0Id,
        name: profile.name || profile.nickname || profile.email?.split("@")[0] || "Vulture User",
        email: profile.email || null,
        avatarUrl: profile.picture || null,
      });

      // Auto-join default squads so the new user immediately has active feeds & permissions
      try {
        await ensureDefaultGroupMemberships(user.id);
      } catch (err) {
        console.warn("[Auth0] Group auto-join error:", err);
      }

      // Encode self-contained session payload so serverless cold starts & memory stores never lose session
      const sessionPayload = {
        id: user.id,
        auth0Id: user.auth0Id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        createdAt: Date.now(),
      };
      const encodedSession = Buffer.from(JSON.stringify(sessionPayload)).toString("base64");

      // Check if connection is actually HTTPS before forcing secure: true (prevents cookie drops over HTTP)
      const isHttps =
        req.nextUrl.protocol === "https:" ||
        req.headers.get("x-forwarded-proto") === "https" ||
        appUrl.startsWith("https://");

      // Create session cookie with real user profile
      const response = NextResponse.redirect(new URL("/dashboard", appUrl));
      response.cookies.set({
        name: "vulture_session",
        value: encodedSession,
        path: "/",
        httpOnly: true,
        secure: isHttps,
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: "lax",
      });

      return response;
    } catch (err) {
      console.error("[Auth0] Error in callback pipeline:", err);
      return NextResponse.redirect(new URL("/login?error=internal_auth_error", appUrl));
    }
  }

  // 3. LOGOUT: Clear session and redirect to Auth0 logout endpoint
  if (action === "logout") {
    const isPrefetch =
      req.headers.get("purpose") === "prefetch" ||
      req.headers.get("sec-purpose") === "prefetch" ||
      req.headers.get("next-router-prefetch") === "1" ||
      req.headers.get("x-middleware-prefetch") === "1";
    if (isPrefetch) {
      return new NextResponse(null, { status: 204 });
    }

    const returnTo = `${appUrl}/login`;
    const logoutUrl = `https://${domain}/v2/logout?client_id=${clientId}&returnTo=${encodeURIComponent(returnTo)}`;
    const response = NextResponse.redirect(logoutUrl);
    response.cookies.delete("vulture_session");
    response.cookies.delete("vulture_demo_user");
    return response;
  }

  return NextResponse.redirect(new URL("/dashboard", appUrl));
}
