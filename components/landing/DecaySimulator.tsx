"use client";

import { useState } from "react";
import { Clock, ShieldAlert, CheckCircle2, Flame, ArrowRight, Zap, Sparkles } from "lucide-react";

export function DecaySimulator() {
  const [decayStage, setDecayStage] = useState<0 | 1 | 2>(0);

  const stages = [
    { label: "T+0m", sub: "FRESH", desc: "Just broadcast. Maximum visual weight, critical alert beacon active, zero delay." },
    { label: "T+20m", sub: "WANING", desc: "Urgency dropping. Visual prominence softens to reduce cognitive load across team." },
    { label: "T+45m", sub: "EXPIRED", desc: "Passed its half-life. Automatically dimmed so you only see what matters right now." },
  ];

  return (
    <div className="w-full rounded-2xl bg-[#0e1017]/90 border border-[#232738] p-5 sm:p-7 relative overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Ambient Pastel Glow */}
      <div className="absolute top-0 left-1/3 w-64 h-32 bg-[#fdba74]/5 blur-3xl pointer-events-none rounded-full" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1f2233] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#d4f65b] animate-pulse" />
            <h3 className="font-mono text-xs font-bold tracking-widest uppercase text-[#f8f8f6]">
              TEMPORAL_DECAY // REALTIME HALF-LIFE SIMULATOR
            </h3>
          </div>
          <p className="text-[11px] font-mono text-[#94a3b8] mt-1">
            Toggle the timeline stages to observe how VULTURE automatically fades stale chatter.
          </p>
        </div>

        {/* Timeline Stage Switcher */}
        <div className="flex items-center gap-1.5 bg-[#12141e] p-1 rounded-xl border border-[#24283b]">
          {stages.map((stage, idx) => (
            <button
              key={stage.label}
              type="button"
              onClick={() => setDecayStage(idx as 0 | 1 | 2)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                decayStage === idx
                  ? "bg-[#d4f65b] text-[#08090b] font-bold shadow-md shadow-[#d4f65b]/20"
                  : "text-[#94a3b8] hover:text-[#f8f8f6] hover:bg-[#1a1d2c]"
              }`}
            >
              <span>{stage.label}</span>
              <span className={`text-[10px] ${decayStage === idx ? "text-[#08090b]/80" : "text-[#64748b]"}`}>
                · {stage.sub}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Simulated Broadcast Item */}
      <div className="mt-6 space-y-4">
        <div
          className={`p-5 rounded-xl border transition-all duration-500 relative ${
            decayStage === 0
              ? "bg-[#141622] border-[#fda4af] border-l-4 shadow-[0_0_25px_rgba(253,164,175,0.15)]"
              : decayStage === 1
              ? "bg-[#10121a] border-[#fdba74]/60 border-l-4 opacity-80"
              : "bg-[#0a0b10] border-[#222533] border-l-2 opacity-40 filter grayscale"
          }`}
        >
          {/* Card Top */}
          <div className="flex items-center justify-between text-[11px] font-mono mb-2.5">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  decayStage === 0
                    ? "bg-[#fda4af]/20 text-[#fda4af] border border-[#fda4af]/40 shadow-sm"
                    : decayStage === 1
                    ? "bg-[#fdba74]/20 text-[#fdba74] border border-[#fdba74]/40"
                    : "bg-[#1c1f2b] text-[#64748b]"
                }`}
              >
                {decayStage === 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#fda4af] critical-indicator" />}
                {decayStage === 0 ? "CRITICAL INCIDENT" : decayStage === 1 ? "DECAYING ALERT" : "EXPIRED"}
              </span>

              <span className="text-[#94a3b8]">Ratnadwip · SRE Lead</span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono">
              <Clock className="w-3.5 h-3.5 text-[#d4f65b]" />
              <span
                className={
                  decayStage === 0
                    ? "text-[#fda4af] font-semibold"
                    : decayStage === 1
                    ? "text-[#fdba74]"
                    : "text-[#64748b]"
                }
              >
                {decayStage === 0 ? "Expires in 30m" : decayStage === 1 ? "Expires in 8m" : "Expired 15m ago"}
              </span>
            </div>
          </div>

          {/* Transcript Content */}
          <p
            className={`text-sm leading-relaxed transition-colors duration-500 font-mono ${
              decayStage === 0
                ? "text-[#f8f8f6] font-medium"
                : decayStage === 1
                ? "text-[#cbd5e1]"
                : "text-[#64748b]"
            }`}
          >
            &ldquo;Auth service is throwing 502 errors. Database pool saturated. Hold all client deploys until resolved.&rdquo;
          </p>

          {/* AI Context Footer */}
          <div className="mt-3 pt-3 border-t border-[#1e2233]/70 flex items-center justify-between text-[11px] font-mono text-[#94a3b8]">
            <span className="flex items-center gap-1 text-[#ddd6fe]">
              <Sparkles className="w-3 h-3 text-[#ddd6fe]" />
              <span>Gemini Assigned Half-life: 30 minutes</span>
            </span>

            <span className="text-[#64748b]">
              {decayStage === 0 ? "Relevance: 100%" : decayStage === 1 ? "Relevance: 35%" : "Relevance: 0%"}
            </span>
          </div>
        </div>

        {/* Dynamic explanation note */}
        <p className="text-xs font-mono text-[#94a3b8] italic">
          &rarr; {stages[decayStage].desc}
        </p>
      </div>
    </div>
  );
}
