import React from "react";

interface PresenceIndicatorProps {
  memberCount: number;
  onlineCount: number;
}

export function PresenceIndicator({ memberCount, onlineCount }: PresenceIndicatorProps) {
  return (
    <div className="flex items-center gap-2 text-xs font-mono text-[#888888]">
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#34c759] shadow-[0_0_6px_rgba(52,199,89,0.6)]" />
        <span className="text-[#cccccc]">{onlineCount} online</span>
      </div>
      <span className="text-[#444444]">·</span>
      <span>{memberCount} members</span>
    </div>
  );
}
