"use client";

import { useState, useEffect } from "react";
import { Mic, Volume2, Sparkles, CheckCircle2 } from "lucide-react";

export function VoiceHeroDemo() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [step, setStep] = useState(0);

  const steps = [
    "Recording audio stream...",
    "ElevenLabs extracting speech tokens...",
    "Gemini inferring context: INCIDENT · 95/100 · 30m window",
    "Broadcast dispatched to squad feed.",
  ];

  const handleSimulate = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setStep(0);

    const timer1 = setTimeout(() => setStep(1), 800);
    const timer2 = setTimeout(() => setStep(2), 1700);
    const timer3 = setTimeout(() => {
      setStep(3);
      setTimeout(() => setIsSimulating(false), 2000);
    }, 2700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  return (
    <div className="w-full rounded-xl bg-[#141414] border border-[#262626] p-4 sm:p-5 relative overflow-hidden text-left">
      <div className="flex items-center justify-between pb-3 border-b border-[#202020] mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#d7f24a] animate-ping" />
          <span className="text-[11px] font-mono text-[#a1a19f] uppercase tracking-wider">
            VOICE_PIPELINE // INTERACTIVE_TRIGGER
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#d7f24a] bg-[#1d1d1d] px-2 py-0.5 rounded border border-[#2b2b2b]">
          ELEVENLABS + GEMINI
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        {/* Mic simulation trigger button */}
        <button
          type="button"
          onClick={handleSimulate}
          disabled={isSimulating}
          className={`px-5 py-3 rounded-lg border font-mono text-xs font-semibold flex items-center justify-center gap-2.5 transition-all ${
            isSimulating
              ? "bg-[#ff453a]/20 border-[#ff453a] text-[#ff453a] animate-pulse"
              : "bg-[#1c1c1c] border-[#303030] hover:border-[#d7f24a] text-[#f1f1ef] hover:bg-[#222222]"
          }`}
        >
          <Mic className={`w-4 h-4 ${isSimulating ? "text-[#ff453a]" : "text-[#d7f24a]"}`} />
          <span>{isSimulating ? "SPEAKING..." : "PRESS TO SIMULATE VOICE"}</span>
        </button>

        {/* Audio Waveform visualization */}
        <div className="flex-1 bg-[#101010] p-3 rounded-lg border border-[#222222] flex items-center gap-3">
          <div className="flex items-center gap-1 h-6">
            <span className={`w-1 bg-[#d7f24a] rounded-full transition-all ${isSimulating ? "wave-bar-1" : "h-2 opacity-30"}`} />
            <span className={`w-1 bg-[#d7f24a] rounded-full transition-all ${isSimulating ? "wave-bar-2" : "h-4 opacity-30"}`} />
            <span className={`w-1 bg-[#d7f24a] rounded-full transition-all ${isSimulating ? "wave-bar-3" : "h-3 opacity-30"}`} />
            <span className={`w-1 bg-[#d7f24a] rounded-full transition-all ${isSimulating ? "wave-bar-4" : "h-5 opacity-30"}`} />
            <span className={`w-1 bg-[#d7f24a] rounded-full transition-all ${isSimulating ? "wave-bar-5" : "h-2 opacity-30"}`} />
          </div>

          <div className="text-xs font-mono text-[#888888] truncate flex-1">
            {isSimulating ? (
              <span className="text-[#f1f1ef] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d7f24a]" />
                {steps[step]}
              </span>
            ) : (
              <span>&ldquo;Tap button to run real-time voice & AI triage test&rdquo;</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
