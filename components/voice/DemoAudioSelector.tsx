"use client";

import React, { useState } from "react";
import { Sparkles, Terminal } from "lucide-react";

interface DemoAudioSelectorProps {
  onSelectTranscript: (text: string) => void;
  disabled?: boolean;
}

const PRESET_BROADCASTS = [
  {
    label: "Incident: Server down",
    text: "Guys, the backend server is down. Don't deploy anything until it's back.",
    priority: "CRITICAL",
  },
  {
    label: "Schedule: Meeting 5 PM",
    text: "The project presentation has been scheduled for 5 PM sharp.",
    priority: "HIGH",
  },
  {
    label: "Task: Check DB pool",
    text: "Can someone check the database connection? The pool seems saturated.",
    priority: "HIGH",
  },
  {
    label: "Status: Pushed frontend",
    text: "I've pushed the latest frontend build. Let me know if you hit any UI bugs.",
    priority: "NORMAL",
  },
  {
    label: "Status: Late 10m",
    text: "I'll join the sync in about ten minutes, stepping away briefly.",
    priority: "LOW",
  },
];

export function DemoAudioSelector({ onSelectTranscript, disabled }: DemoAudioSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-[11px] text-[#666666] hover:text-[#999999] transition-colors font-mono py-1 px-2 rounded hover:bg-[#161616]"
      >
        <Terminal className="w-3 h-3 text-[#d7f24a]" />
        <span>{isOpen ? "Hide instant simulator" : "Or simulate voice broadcast without mic"}</span>
      </button>

      {isOpen && (
        <div className="mt-2 p-3 bg-[#131313] border border-[#262626] rounded-lg max-w-lg w-full flex flex-col gap-2 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between text-[11px] text-[#777777] font-mono border-b border-[#1f1f1f] pb-1.5">
            <span className="flex items-center gap-1 text-[#d7f24a]">
              <Sparkles className="w-3 h-3" />
              Pre-recorded Test Messages
            </span>
            <span>Sends through Gemini pipeline</span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {PRESET_BROADCASTS.map((item, idx) => (
              <button
                key={idx}
                disabled={disabled}
                onClick={() => onSelectTranscript(item.text)}
                className="text-left text-xs bg-[#1a1a1a] hover:bg-[#242424] text-[#d0d0d0] hover:text-[#f1f1ef] px-2.5 py-1.5 rounded border border-[#2a2a2a] transition-all disabled:opacity-50 text-[11px] font-mono flex items-center gap-1.5"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    item.priority === "CRITICAL"
                      ? "bg-[#ff453a]"
                      : item.priority === "HIGH"
                      ? "bg-[#ff9f0a]"
                      : item.priority === "NORMAL"
                      ? "bg-[#64d2ff]"
                      : "bg-[#636366]"
                  }`}
                />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
