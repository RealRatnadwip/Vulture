import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { listUserGroups } from "@/lib/db";
import { Navbar } from "@/components/layout/Navbar";
import { DemoBanner } from "@/components/ui/DemoBanner";
import { GroupSelector } from "@/components/groups/GroupSelector";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const groups = await listUserGroups(user.id);

  return (
    <div className="min-h-screen bg-[#08090b] text-[#f8f8f6] flex flex-col">
      {user.isDemo && <DemoBanner currentUserId={user.id} />}
      <Navbar userName={user.name} avatarUrl={user.avatarUrl || undefined} isDemo={user.isDemo} />

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6">
        <GroupSelector initialGroups={groups} />
      </main>
    </div>
  );
}
