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
        // High-urgency alert vibration pattern: vibrate 300ms, pause 100ms, vibrate 300ms
        navigator.vibrate([300, 100, 300, 100, 500]);
      } catch (err) {
        console.warn("[Vibration] Not permitted or supported:", err);
      }
    }
  }, [message]);

  if (!message) return null;

  const relevance = getMessageRelevance(message);

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a]/98 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 select-none overflow-y-auto">
      {/* Red emergency ambient backlight strobe */}
      <div className="absolute inset-0 pointer-events-none border-4 border-[#ff453a]/60 shadow-[inset_0_0_80px_rgba(255,69,58,0.25)] animate-pulse" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between pb-4 border-b border-[#2a1a1a]">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-[#ff453a] animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff453a]" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-xs font-bold tracking-widest text-[#ff453a] uppercase">
              CRITICAL SQUAD BROADCAST
            </span>
            <span className="font-mono text-[10px] text-[#888888]">
              PRIORITY OVERRIDE // PUSH-TO-TALK ACTIVE
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="w-8 h-8 rounded-full bg-[#1c1c1c] border border-[#333333] hover:border-[#ff453a] text-[#888888] hover:text-[#f1f1ef] flex items-center justify-center transition-colors"
          title="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Middle Body */}
      <div className="relative z-10 my-auto py-6 space-y-6">
        {/* Urgency Badge */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-[#ff453a]/20 border border-[#ff453a]/40 text-[#ff453a] font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            URGENCY: {message.urgencyScore || 95}/100
          </span>
          <span className="px-2 py-1 rounded bg-[#1f1f1f] border border-[#333333] text-[#888888] font-mono text-xs">
            {message.category || "INCIDENT"}
          </span>
          <span className="text-xs font-mono text-[#666666] flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{relevance.label}</span>
          </span>
        </div>

        {/* Sender details */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#202020] border-2 border-[#ff453a]/50 flex items-center justify-center text-sm font-mono font-bold text-[#f1f1ef] overflow-hidden">
            {message.sender.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={message.sender.avatarUrl} alt={message.sender.name} className="w-full h-full object-cover" />
            ) : (
              message.sender.name.slice(0, 1).toUpperCase()
            )}
          </div>
          <div>
            <div className="font-mono text-base font-bold text-[#f1f1ef]">
              {message.sender.name}
            </div>
            <div className="text-xs font-mono text-[#888888]">
              Broadcasted via ElevenLabs STT
            </div>
          </div>
        </div>

        {/* Big Alert Transcript */}
        <div className="p-5 rounded-xl bg-[#141414] border border-[#ff453a]/30 shadow-[0_0_30px_rgba(255,69,58,0.12)]">
          <p className="text-lg sm:text-2xl font-mono text-[#f1f1ef] leading-relaxed font-medium">
            &ldquo;{message.transcript}&rdquo;
          </p>

          {/* Audio Waveform Bar */}
          <div className="mt-4 pt-4 border-t border-[#222222] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-[#888888]">
              <Volume2 className="w-4 h-4 text-[#d7f24a] animate-pulse" />
              <span>Voice transmission verified</span>
            </div>

            <div className="flex items-center gap-1 h-5">
              <span className="w-1 bg-[#d7f24a] rounded-full wave-bar-1" />
              <span className="w-1 bg-[#d7f24a] rounded-full wave-bar-2" />
              <span className="w-1 bg-[#d7f24a] rounded-full wave-bar-3" />
              <span className="w-1 bg-[#d7f24a] rounded-full wave-bar-4" />
              <span className="w-1 bg-[#d7f24a] rounded-full wave-bar-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="relative z-10 pt-4 border-t border-[#222222] flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={onDismiss}
          className="w-full sm:flex-1 py-3.5 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-[#d7f24a] text-[#0e0e0e] hover:bg-[#c6e33b] transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(215,242,74,0.25)] cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>ACKNOWLEDGE ALERT</span>
        </button>

        {onReply && (
          <button
            type="button"
            onClick={() => {
              onDismiss();
              onReply(message);
            }}
            className="w-full sm:w-auto py-3.5 px-5 rounded-xl font-mono text-xs font-medium uppercase tracking-wider bg-[#1c1c1c] text-[#f1f1ef] hover:bg-[#282828] border border-[#333333] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Mic className="w-4 h-4 text-[#ff453a]" />
            <span>TALK BACK</span>
          </button>
        )}
      </div>
    </div>
  );
}
