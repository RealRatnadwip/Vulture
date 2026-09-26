"use client";

import { useEffect, useState } from "react";
import { MessageWithSender } from "@/lib/db";
import { getMessageRelevance } from "@/lib/utils/relevance";
import { ShieldAlert, Volume2, Mic, X, Check, Clock, Radio, AlertTriangle } from "lucide-react";

interface FullScreenAlertProps {
  message: MessageWithSender | null;
  onDismiss: () => void;
  onReply?: (message: MessageWithSender) => void;
}

export function FullScreenAlert({ message, onDismiss, onReply }: FullScreenAlertProps) {
  const [isPlaying, setIsPlaying] = useState(true);

  // Trigger mobile vibration pattern when a critical alert arrives
  useEffect(() => {
    if (!message) return;

    // Standard Web Vibration API (bridges to Android / Capacitor WebView)
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        // High-urgency alert vibration pattern: vibrate 350ms, pause 100ms, vibrate 350ms, pause 100ms, vibrate 600ms
        navigator.vibrate([350, 100, 350, 100, 600]);
      } catch (err) {
        console.warn("[Vibration] Not permitted or supported:", err);
      }
    }
  }, [message]);

  if (!message) return null;

  const relevance = getMessageRelevance(message);

  return (
    <div className="fixed inset-0 z-50 bg-[#08090b]/98 backdrop-blur-3xl flex flex-col justify-between p-6 sm:p-10 animate-in fade-in zoom-in-95 duration-200 select-none overflow-y-auto">
      {/* Pastel Coral emergency ambient backlight strobe */}
      <div className="absolute inset-0 pointer-events-none border-4 border-[#fda4af]/60 shadow-[inset_0_0_100px_rgba(253,164,175,0.25)] animate-pulse" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between pb-5 border-b border-[#241a1f]">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-[#fda4af] animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#fda4af]" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-xs font-extrabold tracking-widest text-[#fda4af] uppercase">
              CRITICAL SQUAD BROADCAST
            </span>
            <span className="font-mono text-[10px] text-[#94a3b8]">
              PRIORITY OVERRIDE // PUSH-TO-TALK ACTIVE
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="w-9 h-9 rounded-xl bg-[#141620] border border-[#2c3246] hover:border-[#fda4af] text-[#94a3b8] hover:text-[#f8f8f6] flex items-center justify-center transition-colors"
          title="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Middle Body */}
      <div className="relative z-10 my-auto py-8 space-y-6 max-w-3xl mx-auto w-full">
        {/* Urgency Badge */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#fda4af]/20 border border-[#fda4af]/40 text-[#fda4af] font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
            <AlertTriangle className="w-3.5 h-3.5" />
            URGENCY: {message.urgencyScore || 95}/100
          </span>
          <span className="px-2.5 py-1 rounded-full bg-[#141622] border border-[#272b3c] text-[#cbd5e1] font-mono text-xs">
            {message.category || "INCIDENT"}
          </span>
          <span className="text-xs font-mono text-[#94a3b8] flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#d4f65b]" />
            <span>{relevance.label}</span>
          </span>
        </div>

        {/* Sender details */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#161824] border-2 border-[#fda4af]/50 flex items-center justify-center text-sm font-mono font-bold text-[#f8f8f6] overflow-hidden shadow-sm">
            {message.sender.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={message.sender.avatarUrl} alt={message.sender.name} className="w-full h-full object-cover" />
            ) : (
              message.sender.name.slice(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <div className="font-mono text-base font-bold text-[#f8f8f6]">
              {message.sender.name}
            </div>
            <div className="text-xs font-mono text-[#94a3b8]">
              Broadcasted via ElevenLabs Scribe
            </div>
          </div>
        </div>

        {/* Big Alert Transcript */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0e1017] border border-[#fda4af]/40 shadow-[0_0_40px_rgba(253,164,175,0.15)]">
          <p className="text-xl sm:text-3xl font-mono text-[#f8f8f6] leading-relaxed font-semibold">
            &ldquo;{message.transcript}&rdquo;
          </p>

          {/* Audio Waveform Bar */}
          <div className="mt-6 pt-5 border-t border-[#1e2233] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-[#94a3b8]">
              <Volume2 className="w-4 h-4 text-[#d4f65b] animate-pulse" />
              <span>Voice transmission verified by Gemini</span>
            </div>

            <div className="flex items-center gap-1.5 h-6">
              <span className="w-1.5 bg-[#d4f65b] rounded-full wave-bar-1" />
              <span className="w-1.5 bg-[#7dd3fc] rounded-full wave-bar-2" />
              <span className="w-1.5 bg-[#ddd6fe] rounded-full wave-bar-3" />
              <span className="w-1.5 bg-[#fda4af] rounded-full wave-bar-4" />
              <span className="w-1.5 bg-[#86efac] rounded-full wave-bar-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="relative z-10 pt-5 border-t border-[#241a1f] flex flex-col sm:flex-row items-center gap-3.5 max-w-3xl mx-auto w-full">
        <button
          type="button"
          onClick={onDismiss}
          className="w-full sm:flex-1 py-4 px-5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-[#d4f65b] text-[#08090b] hover:bg-[#c3e848] transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(212,246,91,0.3)] cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>ACKNOWLEDGE BROADCAST</span>
        </button>

        {onReply && (
          <button
            type="button"
            onClick={() => {
              onDismiss();
              onReply(message);
            }}
            className="w-full sm:w-auto py-4 px-6 rounded-xl font-mono text-xs font-medium uppercase tracking-wider bg-[#141622] text-[#f8f8f6] hover:bg-[#1c1f2e] border border-[#2a2e40] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Mic className="w-4 h-4 text-[#fda4af]" />
            <span>PUSH TO TALK</span>
          </button>
        )}
      </div>
    </div>
  );
}
