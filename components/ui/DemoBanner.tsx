"use client";

import React, { useState } from "react";
import { DEMO_USERS } from "@/lib/auth/demo-users";
import { UserCheck, Sparkles, ChevronDown } from "lucide-react";

interface DemoBannerProps {
  currentUserId?: string;
  onUserSwitch?: (userId: string) => void;
}

export function DemoBanner({ currentUserId = "usr_ratnadwip", onUserSwitch }: DemoBannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const currentUser = DEMO_USERS.find((u) => u.id === currentUserId) || DEMO_USERS[0];

  const handleSelectUser = async (userId: string) => {
    if (userId === currentUserId) {
      setIsOpen(false);
      return;
    }
    setSwitching(true);
    try {
      await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (onUserSwitch) {
        onUserSwitch(userId);
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to switch user", err);
    } finally {
      setSwitching(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="bg-[#121212] border-b border-[#222222] text-xs text-[#888888] px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 z-50">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 font-mono text-[10px] tracking-wider uppercase px-1.5 py-0.5 rounded bg-[#1f1f1f] text-[#d7f24a] border border-[#2e2e2e]">
          <Sparkles className="w-2.5 h-2.5" />
          Demo Mode Active
        </span>
        <span className="hidden sm:inline text-[#666666]">·</span>
        <span className="hidden sm:inline text-[#777777]">
          Tiger Data + ElevenLabs STT + Gemini Engine simulated fallback ready
        </span>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={switching}
          className="flex items-center gap-1.5 py-1 px-2 rounded bg-[#181818] hover:bg-[#202020] text-[#f1f1ef] border border-[#2a2a2a] transition-colors"
          title="Switch persona to test multi-user live feed"
        >
          <span className="text-[11px] text-[#888888]">Speaking as:</span>
          <span className="font-medium text-[11px] text-[#f1f1ef]">{currentUser.name}</span>
          <span className="text-[10px] text-[#666666]">({currentUser.role.split(" ")[0]})</span>
          <ChevronDown className="w-3 h-3 text-[#666666]" />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-1 w-56 rounded border border-[#2d2d2d] bg-[#161616] p-1 shadow-2xl z-50">
            <div className="px-2 py-1 text-[10px] uppercase font-mono tracking-wider text-[#666666] border-b border-[#222222] mb-1">
              Switch Live Persona
            </div>
            {DEMO_USERS.map((user) => (
              <button
                key={user.id}
                onClick={() => handleSelectUser(user.id)}
                className={`w-full text-left flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors ${
                  user.id === currentUserId
                    ? "bg-[#222222] text-[#d7f24a] font-medium"
                    : "text-[#bbbbbb] hover:bg-[#1c1c1c] hover:text-[#f1f1ef]"
                }`}
              >
                <div>
                  <div className="font-sans text-[12px]">{user.name}</div>
                  <div className="text-[10px] text-[#666666]">{user.role}</div>
                </div>
                {user.id === currentUserId && <UserCheck className="w-3.5 h-3.5 text-[#d7f24a]" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
