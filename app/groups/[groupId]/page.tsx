import React from "react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import {
  getGroupById,
  verifyGroupMembership,
  updateMemberLastSeen,
  getGroupPresence,
  getGroupMessages,
} from "@/lib/db";
import { Navbar } from "@/components/layout/Navbar";
import { DemoBanner } from "@/components/ui/DemoBanner";
import { GroupView } from "@/components/feed/GroupView";
import { ShieldX, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface GroupPageProps {
  params: Promise<{ groupId: string }>;
}

export default async function GroupPage({ params }: GroupPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const { groupId } = await params;

  // Verify group membership strictly (Section 6: User should never access another group's feed)
  const isMember = await verifyGroupMembership(groupId, user.id);
  const group = await getGroupById(groupId);

  if (!group) {
    notFound();
  }

  if (!isMember) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] text-[#f1f1ef] flex flex-col">
        {user.isDemo && <DemoBanner currentUserId={user.id} />}
        <Navbar userName={user.name} avatarUrl={user.avatarUrl || undefined} isDemo={user.isDemo} />

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[#201010] border border-[#3e1a1a] flex items-center justify-center mb-4">
            <ShieldX className="w-6 h-6 text-[#ff453a]" />
          </div>
          <h2 className="text-lg font-mono font-bold uppercase text-[#f1f1ef]">
            Access Restricted
          </h2>
          <p className="text-xs text-[#888888] max-w-sm mt-2 font-mono">
            You are not a member of {group.name}. Group feeds are strictly private to members.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-mono bg-[#161616] text-[#cccccc] hover:text-[#f1f1ef] border border-[#262626] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Groups</span>
          </Link>
        </div>
      </div>
    );
  }

  // Update heartbeat
  await updateMemberLastSeen(groupId, user.id);

  // Fetch initial data
  const presence = await getGroupPresence(groupId);
  const initialMessages = await getGroupMessages(groupId, { limit: 50 });

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#f1f1ef] flex flex-col">
      {user.isDemo && <DemoBanner currentUserId={user.id} />}
      <Navbar userName={user.name} avatarUrl={user.avatarUrl || undefined} isDemo={user.isDemo} />

      <GroupView
        group={group}
        initialPresence={presence}
        initialMessages={initialMessages}
      />
    </div>
  );
}
