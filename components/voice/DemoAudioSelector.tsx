"use client";

import React, { useState } from "react";
import { Sparkles, Terminal, ChevronDown, ChevronUp } from "lucide-react";

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
    label: "Incident: DB pool saturated",
    text: "Can someone check the database connection? The pool seems saturated.",
    priority: "HIGH",
  },
  {
    label: "Schedule: Meeting 5 PM",
    text: "The project presentation has been scheduled for 5 PM sharp.",
    priority: "HIGH",
  },
  {
    label: "Status: Pushed frontend build",
    text: "I've pushed the latest frontend build. Let me know if you hit any UI bugs.",
    priority: "NORMAL",
  },
  {
    label: "Status: Stepping away 10m",
    text: "I'll join the sync in about ten minutes, stepping away briefly.",
    priority: "LOW",
  },
];

export function DemoAudioSelector({ onSelectTranscript, disabled }: DemoAudioSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full flex flex-col items-center">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-[11px] text-[#64748b] hover:text-[#94a3b8] transition-colors font-mono py-1 px-2.5 rounded-lg hover:bg-[#10121a]"
      >
        <Sparkles className="w-3 h-3 text-[#d4f65b]" />
        <span>{isOpen ? "Hide sample scenarios" : "Sample emergency scenarios for one-click testing"}</span>
        {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {isOpen && (
        <div className="mt-2 p-3 bg-[#0c0d12] border border-[#1e2230] rounded-xl w-full flex flex-col gap-2 shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-[11px] text-[#64748b] font-mono border-b border-[#181a24] pb-1.5">
            <span className="flex items-center gap-1.5 text-[#ddd6fe] font-semibold">
              <Terminal className="w-3 h-3" />
              <span>Instant AI Broadcast Simulators</span>
            </span>
            <span>Sends through Gemini 3.5 pipeline</span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {PRESET_BROADCASTS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                disabled={disabled}
                onClick={() => {
                  onSelectTranscript(item.text);
                  setIsOpen(false);
                }}
                className="text-left bg-[#10121a] hover:bg-[#151822] text-[#cbd5e1] hover:text-[#f8f8f6] px-2.5 py-1.5 rounded-lg border border-[#1e2230] hover:border-[#2f354a] transition-all disabled:opacity-50 text-[11px] font-mono flex items-center gap-1.5 shadow-sm"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    item.priority === "CRITICAL"
                      ? "bg-[#fda4af]"
                      : item.priority === "HIGH"
                      ? "bg-[#fdba74]"
                      : item.priority === "NORMAL"
                      ? "bg-[#d4f65b]"
                      : "bg-[#7dd3fc]"
                  }`}
                />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
