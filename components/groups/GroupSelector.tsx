"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, LogIn, ChevronRight, Hash, Users, Sparkles } from "lucide-react";
import { CreateGroupModal } from "./CreateGroupModal";
import { JoinGroupModal } from "./JoinGroupModal";

export interface GroupItem {
  id: string;
  name: string;
  inviteCode: string;
  memberCount: number;
  onlineCount: number;
  updatedAt?: string | Date;
}

interface GroupSelectorProps {
  initialGroups: GroupItem[];
}

export function GroupSelector({ initialGroups }: GroupSelectorProps) {
  const [groups, setGroups] = useState<GroupItem[]>(initialGroups);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  const handleGroupCreated = (newGroup: any) => {
    setGroups((prev) => [
      {
        ...newGroup,
        memberCount: 1,
        onlineCount: 1,
      },
      ...prev,
    ]);
  };

  const handleGroupJoined = (joinedGroup: any) => {
    setGroups((prev) => {
      if (prev.some((g) => g.id === joinedGroup.id)) return prev;
      return [
        {
          ...joinedGroup,
          memberCount: (joinedGroup.memberCount || 1) + 1,
          onlineCount: 1,
        },
        ...prev,
      ];
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <h1 className="text-xl font-mono font-bold tracking-tight text-[#f1f1ef]">
            GROUPS
          </h1>
          <p className="text-xs text-[#888888] mt-0.5">
            Select a broadcast channel or connect with an invite code.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsJoinOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono bg-[#181818] hover:bg-[#202020] text-[#cccccc] border border-[#2b2b2b] transition-colors"
          >
            <LogIn className="w-3.5 h-3.5 text-[#999999]" />
            Join Code
          </button>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium bg-[#f1f1ef] text-[#0e0e0e] hover:bg-[#ffffff] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New Group
          </button>
        </div>
      </div>

      {/* Group List Cards */}
      <div className="mt-6 flex flex-col gap-3">
        {groups.map((group) => {
          const isBusy = group.onlineCount > 1;
          const statusText = isBusy ? `${group.onlineCount} active now` : "quiet";

          return (
            <Link
              key={group.id}
              href={`/groups/${group.id}`}
              className="group block p-4 rounded-lg bg-[#141414] hover:bg-[#181818] border border-[#242424] hover:border-[#383838] transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold tracking-wide text-[#f1f1ef] group-hover:text-[#ffffff]">
                      {group.name}
                    </span>
                    <span className="font-mono text-[10px] text-[#555555] px-1.5 py-0.2 rounded bg-[#1b1b1b] border border-[#222222]">
                      {group.inviteCode}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1.5 text-xs text-[#888888] font-mono">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-[#666666]" />
                      <span>{group.memberCount} members</span>
                    </div>
                    <span>·</span>
                    <span className={isBusy ? "text-[#34c759]" : "text-[#777777]"}>
                      {statusText}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-[#555555] group-hover:text-[#d7f24a] transition-colors">
                  <span className="hidden sm:inline font-mono text-[11px]">open</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          );
        })}

        {groups.length === 0 && (
          <div className="py-12 text-center border border-dashed border-[#262626] rounded-lg">
            <p className="text-xs text-[#777777] font-mono">No active groups.</p>
            <p className="text-xs text-[#555555] mt-1">
              Create a new group or join with an invite code to begin broadcasting.
            </p>
          </div>
        )}
      </div>

      <CreateGroupModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onGroupCreated={handleGroupCreated}
      />

      <JoinGroupModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        onGroupJoined={handleGroupJoined}
      />
    </div>
  );
}
