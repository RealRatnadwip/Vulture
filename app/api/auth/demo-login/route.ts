import { NextRequest, NextResponse } from "next/server";
import { getDemoUserById } from "@/lib/auth/demo-users";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId;
    const user = getDemoUserById(userId);

    const response = NextResponse.json({
      success: true,
      user,
    });

    response.cookies.set({
      name: "vulture_demo_user",
      value: user.id,
      path: "/",
      httpOnly: false, // accessible to client for switchers
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    });

    const sessionPayload = {
      id: user.id,
      auth0Id: user.auth0Id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      isDemo: true,
      createdAt: Date.now(),
    };

    response.cookies.set({
      name: "vulture_session",
      value: Buffer.from(JSON.stringify(sessionPayload)).toString("base64"),
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Failed to switch user" }, { status: 400 });
  }
}
