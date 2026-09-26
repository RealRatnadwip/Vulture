"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Radio, Users, Shield } from "lucide-react";
import { MessageWithSender, Group } from "@/lib/db";
import { BroadcastFeed } from "./BroadcastFeed";
import { MicrophoneButton } from "@/components/voice/MicrophoneButton";
import { PresenceIndicator } from "@/components/layout/PresenceIndicator";

interface GroupViewProps {
  group: Group;
  initialPresence: { memberCount: number; onlineCount: number };
  initialMessages: MessageWithSender[];
}

export function GroupView({ group, initialPresence, initialMessages }: GroupViewProps) {
  const [copied, setCopied] = useState(false);
  const [presence, setPresence] = useState(initialPresence);

  const copyInviteCode = () => {
    navigator.clipboard.writeText(group.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMessageBroadcasted = (newMsg: MessageWithSender) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("vulture:new-broadcast", { detail: newMsg }));
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.75rem)] max-w-4xl mx-auto w-full px-4 sm:px-6 pb-40 pt-5">
      {/* Group Header */}
      <div className="pb-5 mb-4 border-b border-[#212433]">
        <div className="flex items-center justify-between mb-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#94a3b8] hover:text-[#f8f8f6] transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>CHANNELS DIRECTORY</span>
          </Link>

          <button
            onClick={copyInviteCode}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#12141f] hover:bg-[#181b29] text-[11px] font-mono text-[#94a3b8] hover:text-[#f8f8f6] border border-[#23273a] transition-all"
            title="Copy group invite code"
          >
            <span className="text-[#64748b]">CODE:</span>
            <span className="text-[#d4f65b] font-bold">{group.inviteCode}</span>
            {copied ? <Check className="w-3 h-3 text-[#86efac]" /> : <Copy className="w-3 h-3 text-[#64748b]" />}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#141724] border border-[#272c3f] flex items-center justify-center text-[#d4f65b] shadow-sm">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-mono font-extrabold tracking-tight text-[#f8f8f6]">
                {group.name}
              </h1>
              <p className="text-[11px] font-mono text-[#64748b] mt-0.5">
                VOICE BROADCAST STREAM // AI CONTEXT TRIAGE ACTIVE
              </p>
            </div>
          </div>

          <PresenceIndicator
            memberCount={presence.memberCount}
            onlineCount={presence.onlineCount}
          />
        </div>
      </div>

      {/* Main Broadcast Feed */}
      <main className="flex-1 w-full">
        <BroadcastFeed groupId={group.id} initialMessages={initialMessages} />
      </main>

      {/* Floating Tactical Push-To-Talk Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#090b10]/90 backdrop-blur-2xl border-t border-[#202538] py-4 px-4 shadow-[0_-15px_35px_rgba(0,0,0,0.6)]">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <MicrophoneButton
            groupId={group.id}
            onMessageBroadcasted={handleMessageBroadcasted}
          />
        </div>
      </div>
    </div>
  );
}
