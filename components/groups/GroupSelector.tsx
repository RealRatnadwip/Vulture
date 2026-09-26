"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, LogIn, ChevronRight, Hash, Users, Sparkles, Copy, Check, Radio } from "lucide-react";
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
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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

  const copyCode = (e: React.MouseEvent, code: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#212433]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#d4f65b] animate-ping" />
            <h1 className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-[#f8f8f6] uppercase">
              SQUAD CHANNELS
            </h1>
          </div>
          <p className="text-xs font-mono text-[#94a3b8]">
            Select an active tactical broadcast channel or enter an invite code.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsJoinOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono bg-[#13151f] hover:bg-[#1a1c2a] text-[#cbd5e1] border border-[#272b3c] transition-all hover:border-[#3e445d]"
          >
            <LogIn className="w-3.5 h-3.5 text-[#ddd6fe]" />
            <span>JOIN CODE</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-[#d4f65b] text-[#08090b] hover:bg-[#c3e848] transition-all shadow-[0_0_20px_rgba(212,246,91,0.2)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>NEW CHANNEL</span>
          </button>
        </div>
      </div>

      {/* Group List Cards */}
      <div className="mt-6 flex flex-col gap-3.5">
        {groups.map((group) => {
          const isBusy = group.onlineCount > 1;

          return (
            <Link
              key={group.id}
              href={`/groups/${group.id}`}
              className="group block p-4 sm:p-5 rounded-2xl bg-[#0e1017]/90 hover:bg-[#131622] border border-[#222534] hover:border-[#383e54] transition-all shadow-lg hover:shadow-xl relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#141724] border border-[#262b3d] flex items-center justify-center text-[#d4f65b] group-hover:border-[#d4f65b]/50 group-hover:scale-105 transition-all">
                    <Radio className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-mono font-bold text-[#f8f8f6] group-hover:text-[#d4f65b] transition-colors">
                        {group.name}
                      </h2>
                    </div>

                    <div className="flex items-center gap-3 mt-1 text-xs font-mono text-[#94a3b8]">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-[#64748b]" />
                        <span>{group.memberCount} squad members</span>
                      </span>

                      <span className="text-[#3b4054]">·</span>

                      <span className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${isBusy ? "bg-[#86efac] animate-pulse" : "bg-[#64748b]"}`} />
                        <span className={isBusy ? "text-[#86efac] font-medium" : "text-[#64748b]"}>
                          {isBusy ? `${group.onlineCount} online` : "quiet"}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Area: Invite Code & Arrow */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1a1c28]">
                  <button
                    type="button"
                    onClick={(e) => copyCode(e, group.inviteCode)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141622] hover:bg-[#1a1d2d] text-[11px] font-mono text-[#94a3b8] hover:text-[#f8f8f6] border border-[#242839] transition-colors"
                    title="Click to copy invite code"
                  >
                    <span>CODE: {group.inviteCode}</span>
                    {copiedCode === group.inviteCode ? (
                      <Check className="w-3 h-3 text-[#86efac]" />
                    ) : (
                      <Copy className="w-3 h-3 text-[#64748b]" />
                    )}
                  </button>

                  <div className="w-8 h-8 rounded-lg bg-[#131622] border border-[#232738] flex items-center justify-center text-[#94a3b8] group-hover:text-[#d4f65b] group-hover:border-[#d4f65b]/50 transition-all">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        {groups.length === 0 && (
          <div className="p-12 text-center border border-dashed border-[#222534] rounded-2xl">
            <Radio className="w-8 h-8 text-[#64748b] mx-auto mb-2" />
            <p className="font-mono text-sm text-[#94a3b8]">No broadcast channels joined yet.</p>
            <p className="font-mono text-xs text-[#64748b] mt-1">
              Create a new channel or join with an existing squad invite code.
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateGroupModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={handleGroupCreated}
      />
      <JoinGroupModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        onJoined={handleGroupJoined}
      />
    </div>
  );
}
