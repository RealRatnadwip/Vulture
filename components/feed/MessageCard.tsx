"use client";

import React from "react";
import { MessageWithSender } from "@/lib/db";
import { getMessageRelevance, formatBroadcastTime } from "@/lib/utils/relevance";
import { Clock, ShieldAlert } from "lucide-react";

interface MessageCardProps {
  message: MessageWithSender;
  isNew?: boolean;
}

export function MessageCard({ message, isNew }: MessageCardProps) {
  const relevance = getMessageRelevance(message);
  const isCritical = message.priority === "CRITICAL";
  const isHigh = message.priority === "HIGH";
  const isLow = message.priority === "LOW";
  const isExpired = relevance.state === "EXPIRED";

  // Card border styling
  let borderClass = "border-l-2 border-[#262626]";
  if (isCritical) {
    borderClass = "border-l-2 border-l-[#ff453a] border-t-[#291b1b] border-r-[#241c1c] border-b-[#241c1c]";
  } else if (isHigh) {
    borderClass = "border-l-2 border-l-[#ff9f0a]";
  } else if (isLow) {
    borderClass = "border-l-2 border-l-[#3a3a3c]";
  }

  return (
    <article
      className={`relative p-4 rounded-md bg-[#151515] border border-[#242424] transition-all ${borderClass} ${
        isExpired ? "opacity-50 hover:opacity-80" : ""
      } ${isNew ? "ring-1 ring-[#d7f24a]/30 animate-in fade-in slide-in-from-top-2" : ""}`}
    >
      {/* Priority Ribbon / Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {isCritical && (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ff453a] critical-indicator" />
              <span className="font-mono text-[11px] font-bold tracking-wider text-[#ff453a] uppercase">
                CRITICAL PRIORITY
              </span>
            </div>
          )}

          {isHigh && (
            <span className="font-mono text-[11px] font-semibold tracking-wider text-[#ff9f0a] uppercase">
              HIGH PRIORITY
            </span>
          )}

          {!isCritical && !isHigh && !isLow && (
            <span className="font-mono text-[10px] tracking-wider text-[#666666] uppercase">
              NORMAL
            </span>
          )}

          {isLow && (
            <span className="font-mono text-[10px] tracking-wider text-[#444444] uppercase">
              LOW
            </span>
          )}
        </div>

        {/* Relevance / Time indicator */}
        <div className="flex items-center gap-1 text-[11px] font-mono text-[#666666]">
          <Clock className="w-3 h-3" />
          <span className={relevance.state === "EXPIRING" ? "text-[#ff9f0a]" : ""}>
            {relevance.label}
          </span>
        </div>
      </div>

      {/* Sender line & Timestamp */}
      <div className="flex items-center gap-2 mb-2 text-xs">
        <span className={`font-medium ${isExpired ? "text-[#888888]" : "text-[#e2e2e0]"}`}>
          {message.sender.name}
        </span>
        <span className="text-[#444444]">·</span>
        <time className="text-[#777777] font-mono text-[11px]">
          {formatBroadcastTime(message.createdAt)}
        </time>
      </div>

      {/* Transcript / Spoken content */}
      <div className="mb-3">
        <p
          className={`text-sm leading-relaxed ${
            isCritical
              ? "text-[#f5f5f3] font-medium"
              : isLow
              ? "text-[#8e8e93]"
              : isExpired
              ? "text-[#777777]"
              : "text-[#d8d8d6]"
          }`}
        >
          {message.transcript}
        </p>

        {/* Gemini Summary */}
        {message.summary && message.summary !== message.transcript && (
          <div className="mt-2 text-xs text-[#999999] bg-[#111111] border border-[#222222] px-2.5 py-1.5 rounded font-mono">
            <span className="text-[#666666] mr-1.5">signal:</span>
            {message.summary}
          </div>
        )}
      </div>

      {/* Footer Tags */}
      <div className="flex items-center justify-between text-[10px] font-mono text-[#666666] pt-2 border-t border-[#1c1c1c]">
        <div className="flex items-center gap-2">
          <span className="uppercase text-[#888888] tracking-wider">{message.category}</span>
          <span>·</span>
          <span className="uppercase">{message.priority}</span>
        </div>

        {message.urgencyScore !== undefined && (
          <div className="flex items-center gap-1">
            <span className="text-[#555555]">urgency</span>
            <span
              className={`font-semibold ${
                message.urgencyScore >= 80
                  ? "text-[#ff453a]"
                  : message.urgencyScore >= 60
                  ? "text-[#ff9f0a]"
                  : "text-[#888888]"
              }`}
            >
              {message.urgencyScore}/100
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
