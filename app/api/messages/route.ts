import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { verifyGroupMembership, getGroupMessages } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("groupId");
    const sinceParam = searchParams.get("since");
    const limitParam = searchParams.get("limit");

    if (!groupId) {
      return NextResponse.json({ error: "groupId is required" }, { status: 400 });
    }

    // Verify membership
    const isMember = await verifyGroupMembership(groupId, user.id);
    if (!isMember) {
      return NextResponse.json({ error: "Forbidden: Not a member of this group" }, { status: 403 });
    }

    const since = sinceParam ? new Date(sinceParam) : undefined;
    const limit = limitParam ? Math.min(100, parseInt(limitParam, 10)) : 50;

    const messages = await getGroupMessages(groupId, { since, limit });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("[GET /api/messages] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
