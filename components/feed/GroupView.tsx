"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Radio } from "lucide-react";
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
    // Dispatches custom event to BroadcastFeed to update instantly
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("vulture:new-broadcast", { detail: newMsg }));
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)] max-w-3xl mx-auto w-full px-4 pb-36 pt-4">
      {/* Group Header */}
      <div className="pb-4 mb-2 border-b border-[#222222]">
        <div className="flex items-center justify-between mb-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#777777] hover:text-[#cccccc] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ALL GROUPS</span>
          </Link>

          <button
            onClick={copyInviteCode}
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#161616] hover:bg-[#1f1f1f] text-[11px] font-mono text-[#888888] hover:text-[#cccccc] border border-[#242424] transition-colors"
            title="Copy group invite code"
          >
            <span>CODE: {group.inviteCode}</span>
            {copied ? <Check className="w-3 h-3 text-[#34c759]" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-[#f1f1ef]">
              {group.name}
            </h1>
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

      {/* Fixed / Floating Push-To-Talk Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#0e0e0e]/95 backdrop-blur-md border-t border-[#1f1f1f] py-3 px-4 shadow-[0_-10px_25px_rgba(0,0,0,0.5)]">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <MicrophoneButton
            groupId={group.id}
            onMessageBroadcasted={handleMessageBroadcasted}
          />
        </div>
      </div>
    </div>
  );
}
