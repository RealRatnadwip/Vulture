"use client";

import { useState } from "react";
import { Clock, ShieldAlert, CheckCircle2, Flame, ArrowRight } from "lucide-react";

export function DecaySimulator() {
  const [decayStage, setDecayStage] = useState<0 | 1 | 2>(0);

  const stages = [
    { label: "T+0m · FRESH", desc: "Just broadcast. Maximum visual weight & critical beacon active." },
    { label: "T+20m · FADING", desc: "Urgency dropping. Visual prominence softens to reduce cognitive load." },
    { label: "T+45m · EXPIRED", desc: "Passed its half-life. Automatically dimmed so you only see what matters now." },
  ];

  return (
    <div className="w-full rounded-xl bg-[#121212] border border-[#222222] p-5 sm:p-7 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1e1e1e] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#d7f24a] animate-pulse" />
            <h3 className="font-mono text-xs font-bold tracking-wider uppercase text-[#f1f1ef]">
              CONCEPT DEMO // REALTIME TIME-DECAY SIMULATOR
            </h3>
          </div>
          <p className="text-[11px] font-mono text-[#777777] mt-1">
            Toggle the timeline to see how VULTURE automatically fades stale information.
          </p>
        </div>

        {/* Timeline Buttons */}
        <div className="flex items-center gap-1.5 bg-[#171717] p-1 rounded-lg border border-[#262626]">
          {stages.map((stage, idx) => (
            <button
              key={stage.label}
              type="button"
              onClick={() => setDecayStage(idx as 0 | 1 | 2)}
              className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all ${
                decayStage === idx
                  ? "bg-[#d7f24a] text-[#0e0e0e] font-bold shadow-sm"
                  : "text-[#888888] hover:text-[#cccccc]"
              }`}
            >
              {stage.label.split("·")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Simulated Broadcast Item */}
      <div className="mt-6 space-y-4">
        <div
          className={`p-4 rounded-lg border transition-all duration-500 ${
            decayStage === 0
              ? "bg-[#181818] border-[#ff453a]/70 border-l-4 shadow-[0_0_20px_rgba(255,69,58,0.12)]"
              : decayStage === 1
              ? "bg-[#141414] border-[#ff9f0a]/40 border-l-4 opacity-75"
              : "bg-[#101010] border-[#2c2c2e] border-l-2 opacity-35 filter grayscale"
          }`}
        >
          {/* Card Top */}
          <div className="flex items-center justify-between text-[11px] font-mono mb-2">
            <div className="flex items-center gap-2">
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                  decayStage === 0
                    ? "bg-[#ff453a]/15 text-[#ff453a] border border-[#ff453a]/30"
                    : decayStage === 1
                    ? "bg-[#ff9f0a]/15 text-[#ff9f0a] border border-[#ff9f0a]/30"
                    : "bg-[#252525] text-[#777777]"
                }`}
              >
                {decayStage === 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#ff453a] critical-indicator" />}
                {decayStage === 0 ? "CRITICAL INCIDENT" : decayStage === 1 ? "WANING ALERT" : "EXPIRED"}
              </span>

              <span className="text-[#888888]">Ratnadwip · Lead</span>
            </div>

            <div className="flex items-center gap-1.5 text-[#666666] text-[10px]">
              <Clock className="w-3 h-3" />
              <span>
                {decayStage === 0 ? "Expires in 30m" : decayStage === 1 ? "Expires in 8m" : "Expired 15m ago"}
              </span>
            </div>
          </div>

          {/* Transcript Content */}
          <p
            className={`text-sm transition-colors duration-500 font-sans ${
              decayStage === 0
                ? "text-[#f1f1ef] font-medium"
                : decayStage === 1
                ? "text-[#d1d1cd]"
                : "text-[#666666]"
            }`}
          >
            &ldquo;Auth service is throwing 502 errors. Database pool saturated. Hold all client deploys until resolved.&rdquo;
          </p>

          {/* AI Metadata pill */}
          <div className="mt-3 flex items-center gap-2 text-[10px] font-mono text-[#666666]">
            <span className="bg-[#1b1b1b] px-2 py-0.5 rounded border border-[#2a2a2a] text-[#8e8e8e]">
              GEMINI_SCORE: {decayStage === 0 ? "96/100" : decayStage === 1 ? "62/100" : "12/100"}
            </span>
            <span className="bg-[#1b1b1b] px-2 py-0.5 rounded border border-[#2a2a2a] text-[#8e8e8e]">
              ELEVENLABS: TRANSCRIBED (1.2s)
            </span>
          </div>
        </div>

        {/* Status Callout */}
        <div className="p-3 rounded-lg bg-[#161616] border border-[#222222] text-xs font-mono text-[#999999] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#d7f24a] font-bold">STATE:</span>
            <span>{stages[decayStage].desc}</span>
          </div>
          <span className="text-[10px] text-[#555555] uppercase hidden sm:inline">
            AUTO-SORTED BY TIME
          </span>
        </div>
      </div>
    </div>
  );
}
