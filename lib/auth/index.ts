import { cookies, headers } from "next/headers";
import { DEMO_USERS, DEFAULT_DEMO_USER, getDemoUserById, DemoUser } from "./demo-users";
import { getUserById, upsertUser, ensureDefaultGroupMemberships } from "@/lib/db";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
  auth0Id: string;
  isDemo: boolean;
}

export function isAuth0Configured(): boolean {
  const secret = process.env.AUTH0_SECRET;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const issuer = process.env.AUTH0_ISSUER_BASE_URL;
  return Boolean(
    secret &&
      clientId &&
      issuer &&
      secret !== "32_bytes_random_secret_at_least_32_characters_long_for_auth0" &&
      clientId !== "dummy_client_id" &&
      clientId !== "vulture_auth0_client_id" &&
      clientId !== "your_auth0_client_id"
  );
}

export function isDemoModeEnabled(): boolean {
  // If explicitly set to false, demo mode is strictly disabled
  if (process.env.DEMO_MODE === "false") {
    return false;
  }
  // If explicitly set to true, demo mode is enabled
  if (process.env.DEMO_MODE === "true") {
    return true;
  }
  // Otherwise, only enable demo mode as fallback if Auth0 is not configured
  return !isAuth0Configured();
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const cookieStore = await cookies();
  const headerStore = await headers();

  // 1. Check for real Auth0 session cookie first
  const rawSession = cookieStore.get("vulture_session")?.value;
  if (rawSession) {
    try {
      let parsedUser: AuthenticatedUser | null = null;

      // Handle self-contained base64 JSON payload
      if (!rawSession.startsWith("usr_")) {
        try {
          const decoded = JSON.parse(Buffer.from(rawSession, "base64").toString("utf-8"));
          if (decoded?.id && decoded?.auth0Id) {
            parsedUser = {
              id: decoded.id,
              name: decoded.name || "Vulture User",
              email: decoded.email || null,
              avatarUrl: decoded.avatarUrl || null,
              auth0Id: decoded.auth0Id,
              isDemo: false,
            };
          }
        } catch {
          // not base64 json
        }
      }

      // If not base64 json or failed, fallback to DB lookup
      if (!parsedUser) {
        const dbUser = await getUserById(rawSession);
        if (dbUser) {
          parsedUser = {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            avatarUrl: dbUser.avatarUrl,
            auth0Id: dbUser.auth0Id,
            isDemo: false,
          };
        }
      }

      if (parsedUser) {
        // Ensure user is registered in active database/memoryStore and has default groups
        try {
          await upsertUser({
            id: parsedUser.id,
            auth0Id: parsedUser.auth0Id,
            name: parsedUser.name,
            email: parsedUser.email,
            avatarUrl: parsedUser.avatarUrl,
          });
          await ensureDefaultGroupMemberships(parsedUser.id);
        } catch (err) {
          console.warn("[Auth] Sync user state error:", err);
        }

        return parsedUser;
      }
    } catch (err) {
      console.warn("[Auth] Error reading user session:", err);
    }
  }

  // 2. If DEMO_MODE is disabled, do NOT fall back to demo user
  if (!isDemoModeEnabled()) {
    return null;
  }

  // 3. Demo user resolution (only when demo mode is active)
  let demoUserId = cookieStore.get("vulture_demo_user")?.value;

  if (!demoUserId) {
    const rawCookie = headerStore.get("cookie") || "";
    const match = rawCookie.match(/vulture_demo_user=([^;]+)/);
    if (match) demoUserId = match[1].trim();
  }

  if (!demoUserId) {
    const customUserHeader = headerStore.get("x-vulture-user");
    if (customUserHeader) demoUserId = customUserHeader.trim();
  }

  const demoProfile: DemoUser = demoUserId ? getDemoUserById(demoUserId) : DEFAULT_DEMO_USER;

  // Ensure user exists in DB/memory store
  try {
    const existing = await getUserById(demoProfile.id);
    if (!existing) {
      await upsertUser({
        id: demoProfile.id,
        auth0Id: demoProfile.auth0Id,
        name: demoProfile.name,
        email: demoProfile.email,
        avatarUrl: demoProfile.avatarUrl,
      });
    }
  } catch (err) {
    console.warn("[Auth] Demo user upsert skipped:", err);
  }

  return {
    id: demoProfile.id,
    name: demoProfile.name,
    email: demoProfile.email,
    avatarUrl: demoProfile.avatarUrl,
    auth0Id: demoProfile.auth0Id,
    isDemo: true,
  };
}
