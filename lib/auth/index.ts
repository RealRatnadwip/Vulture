import { cookies, headers } from "next/headers";
import { DEMO_USERS, DEFAULT_DEMO_USER, getDemoUserById, DemoUser } from "./demo-users";
import { getUserById, upsertUser } from "@/lib/db";

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
      clientId !== "vulture_auth0_client_id"
  );
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const cookieStore = await cookies();
  const headerStore = await headers();
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

  const isDemo = process.env.DEMO_MODE === "true" || !isAuth0Configured();


  // If Auth0 is active and configured
  if (isAuth0Configured()) {
    try {
      // In production Auth0 mode:
      // const session = await getSession();
      // if (session?.user) ...
    } catch {
      // fallback to demo if allowed
    }
  }

  // Demo user resolution
  if (isDemo) {
    const demoProfile: DemoUser = demoUserId ? getDemoUserById(demoUserId) : DEFAULT_DEMO_USER;

    // Ensure user exists in our DB/store
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

    return {
      id: demoProfile.id,
      name: demoProfile.name,
      email: demoProfile.email,
      avatarUrl: demoProfile.avatarUrl,
      auth0Id: demoProfile.auth0Id,
      isDemo: true,
    };
  }

  return null;
}
