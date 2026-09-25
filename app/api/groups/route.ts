import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { listUserGroups, createGroup, joinGroup } from "@/lib/db";
import { createGroupSchema, joinGroupSchema } from "@/lib/validation";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const groups = await listUserGroups(user.id);
    return NextResponse.json({ groups });
  } catch (error) {
    console.error("[GET /api/groups] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch groups" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const action = body.action || "create";

    if (action === "join") {
      const parsed = joinGroupSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: "Invalid invite code" }, { status: 400 });
      }

      const result = await joinGroup(parsed.data.inviteCode, user.id, user);
      if (!result.success) {
        return NextResponse.json({ error: result.error || "Could not join group" }, { status: 400 });
      }

      return NextResponse.json({ success: true, group: result.group });
    }

    // Create group
    const parsed = createGroupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Group name must be between 2 and 50 characters" }, { status: 400 });
    }

    // Generate short human-readable invite code e.g. "TEAM-482"
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const prefix = parsed.data.name.replace(/[^A-Za-z]/g, "").slice(0, 4).toUpperCase() || "VULT";
    const inviteCode = `${prefix}-${randomSuffix}`;

    const newGroup = await createGroup(parsed.data.name, inviteCode, user.id, user);
    return NextResponse.json({ success: true, group: newGroup });
  } catch (error) {
    console.error("[POST /api/groups] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process group request" },
      { status: 500 }
    );
  }
}
