"use client";

import React, { useState } from "react";
import { MessageWithSender } from "@/lib/db";
import { getMessageRelevance, formatBroadcastTime } from "@/lib/utils/relevance";
import { Clock, ShieldAlert, AlertTriangle, Radio, Sparkles, Volume2, Play, Pause, CornerDownRight } from "lucide-react";

interface MessageCardProps {
  message: MessageWithSender;
  isNew?: boolean;
  onTriggerAlert?: (message: MessageWithSender) => void;
}

export function MessageCard({ message, isNew, onTriggerAlert }: MessageCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const relevance = getMessageRelevance(message);

  const isCritical = message.priority === "CRITICAL";
  const isHigh = message.priority === "HIGH";
  const isLow = message.priority === "LOW";
  const isExpired = relevance.state === "EXPIRED";

  // Card border styling with bright pastel edges
  let borderClass = "border-l-4 border-l-[#2a2e3f] border-[#222534]";
  if (isCritical) {
    borderClass = "border-l-4 border-l-[#fda4af] border-[#382329] shadow-[0_0_20px_rgba(253,164,175,0.12)]";
  } else if (isHigh) {
    borderClass = "border-l-4 border-l-[#fdba74] border-[#382b22]";
  } else if (isLow) {
    borderClass = "border-l-4 border-l-[#7dd3fc] border-[#1e2a35]";
  } else {
    borderClass = "border-l-4 border-l-[#d4f65b] border-[#263124]";
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // If audio is provided, can control html audio element
  };

  return (
    <article
      className={`relative p-5 rounded-2xl bg-[#0e1017]/95 border transition-all ${borderClass} ${
        isExpired ? "opacity-45 hover:opacity-75" : ""
      } ${isNew ? "ring-2 ring-[#d4f65b]/40 animate-in fade-in slide-in-from-top-2" : ""}`}
    >
      {/* Priority Ribbon & Time-Decay Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {isCritical && (
            <button
              type="button"
              onClick={() => onTriggerAlert?.(message)}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fda4af]/15 border border-[#fda4af]/40 hover:bg-[#fda4af]/25 transition-all cursor-pointer group"
              title="Click to view full-screen emergency takeover"
            >
              <span className="w-2 h-2 rounded-full bg-[#fda4af] critical-indicator" />
              <span className="font-mono text-[11px] font-bold tracking-wider text-[#fda4af] uppercase">
                CRITICAL // TAP FOR TAKEOVER
              </span>
            </button>
          )}

          {isHigh && (
            <span className="font-mono text-[11px] font-bold tracking-wider text-[#fdba74] uppercase px-2.5 py-0.5 rounded-full bg-[#fdba74]/15 border border-[#fdba74]/35">
              HIGH PRIORITY
            </span>
          )}

          {!isCritical && !isHigh && !isLow && (
            <span className="font-mono text-[11px] font-bold tracking-wider text-[#d4f65b] uppercase px-2.5 py-0.5 rounded-full bg-[#d4f65b]/12 border border-[#d4f65b]/35">
              SQUAD BROADCAST
            </span>
          )}

          {isLow && (
            <span className="font-mono text-[10px] tracking-wider text-[#7dd3fc] uppercase px-2 py-0.5 rounded-full bg-[#7dd3fc]/10 border border-[#7dd3fc]/30">
              ROUTINE COMM
            </span>
          )}

          {message.category && (
            <span className="font-mono text-[10px] text-[#64748b] hidden sm:inline">
              // {message.category}
            </span>
          )}
        </div>

        {/* Time-Decay relative clock */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-[#94a3b8] px-2.5 py-0.5 rounded-full bg-[#12141e] border border-[#222638]">
          <Clock className="w-3 h-3 text-[#d4f65b]" />
          <span
            className={
              relevance.state === "EXPIRING"
                ? "text-[#fdba74] font-medium"
                : isExpired
                ? "text-[#64748b]"
                : "text-[#94a3b8]"
            }
            suppressHydrationWarning
          >
            {relevance.label}
          </span>
        </div>
      </div>

      {/* Sender line & Timestamp */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#161824] border border-[#2c3144] flex items-center justify-center font-mono text-[10px] font-bold text-[#d4f65b]">
            {message.sender.name.charAt(0).toUpperCase()}
          </div>
          <span className={`font-mono font-bold ${isExpired ? "text-[#94a3b8]" : "text-[#f8f8f6]"}`}>
            {message.sender.name}
          </span>
          <span className="text-[#3b4054]">·</span>
          <time className="text-[#64748b] font-mono text-[11px]" suppressHydrationWarning>
            {formatBroadcastTime(message.createdAt)}
          </time>
        </div>

        {/* Audio Duration if voice */}
        {message.durationMs && (
          <span className="font-mono text-[11px] text-[#94a3b8] flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-[#d4f65b]" />
            <span>{Math.round(message.durationMs / 1000)}s</span>
          </span>
        )}
      </div>

      {/* Spoken Transcript */}
      <div className="mb-3.5">
        <p
          className={`text-sm leading-relaxed font-mono ${
            isExpired ? "text-[#64748b] line-through" : "text-[#f8f8f6]"
          }`}
        >
          {message.transcript}
        </p>
      </div>

      {/* AI Summary Card (Gemini Extraction) */}
      {message.summary && (
        <div className="p-3 rounded-xl bg-[#11131c] border border-[#202538] flex items-start gap-2.5">
          <Sparkles className="w-3.5 h-3.5 text-[#ddd6fe] shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <span className="font-mono text-[10px] font-bold text-[#ddd6fe] uppercase tracking-wider block mb-0.5">
              Gemini AI Summary:
            </span>
            <p className="font-mono text-xs text-[#cbd5e1] leading-relaxed">
              &ldquo;{message.summary}&rdquo;
            </p>
          </div>
        </div>
      )}
    </article>
  );
}
