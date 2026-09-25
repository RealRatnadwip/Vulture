import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getGroupById, verifyGroupMembership, updateMemberLastSeen, getGroupPresence } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { groupId } = await params;

    const isMember = await verifyGroupMembership(groupId, user.id);
    if (!isMember) {
      return NextResponse.json({ error: "Forbidden: Not a member of this group" }, { status: 403 });
    }

    const group = await getGroupById(groupId);
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Update presence heartbeat
    await updateMemberLastSeen(groupId, user.id);
    const presence = await getGroupPresence(groupId);

    return NextResponse.json({
      group,
      presence,
    });
  } catch (error) {
    console.error("[GET /api/groups/[groupId]] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch group details" },
      { status: 500 }
    );
  }
}
