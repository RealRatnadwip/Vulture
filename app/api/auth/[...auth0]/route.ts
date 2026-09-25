import { NextRequest, NextResponse } from "next/server";
import { isAuth0Configured } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ auth0: string[] }> }
) {
  const { auth0 } = await params;
  const action = auth0?.[0] || "login";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!isAuth0Configured()) {
    // Demo Mode handling
    if (action === "logout") {
      const response = NextResponse.redirect(new URL("/login", appUrl));
      response.cookies.delete("vulture_demo_user");
      return response;
    }
    return NextResponse.redirect(new URL("/dashboard", appUrl));
  }

  // When Auth0 is configured with real credentials
  const domain = process.env.AUTH0_ISSUER_BASE_URL?.replace(/^https?:\/\//, "");
  const clientId = process.env.AUTH0_CLIENT_ID;

  if (action === "login") {
    const redirectUri = `${appUrl}/api/auth/callback`;
    const authUrl = `https://${domain}/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=openid profile email`;
    return NextResponse.redirect(authUrl);
  }

  if (action === "logout") {
    const returnTo = `${appUrl}/login`;
    const logoutUrl = `https://${domain}/v2/logout?client_id=${clientId}&returnTo=${encodeURIComponent(returnTo)}`;
    const response = NextResponse.redirect(logoutUrl);
    response.cookies.delete("vulture_demo_user");
    return response;
  }

  return NextResponse.redirect(new URL("/dashboard", appUrl));
}
