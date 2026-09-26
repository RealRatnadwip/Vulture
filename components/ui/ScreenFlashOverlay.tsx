"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { PriorityLevel } from "@/lib/validation";
import { PRIORITY_CONFIG, triggerPriorityVibration } from "@/lib/utils/hapticsAndAlerts";
import { AlertTriangle, Radio, ShieldAlert, X, Volume2, Sparkles } from "lucide-react";

export interface FlashAlertData {
  id: string;
  priority: PriorityLevel;
  senderName?: string;
  transcript?: string;
  summary?: string;
  urgencyScore?: number;
  category?: string;
}

interface ScreenFlashOverlayProps {
  alert?: FlashAlertData | null;
  onDismiss?: () => void;
}

/**
 * Tactical audio synthesizer using browser AudioContext for synchronized acoustic cues.
 */
function playTacticalCue(priority: PriorityLevel) {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (priority) {
      case "CRITICAL":
        // Urgent dual high-pitch chirp (880Hz -> 1320Hz)
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.12);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
        break;

      case "HIGH":
        // Warning tone (660Hz -> 880Hz)
        osc.type = "triangle";
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
        break;

      case "NORMAL":
        // Clean tactical blip (520Hz)
        osc.type = "sine";
        osc.frequency.setValueAtTime(520, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
        break;

      case "LOW":
        // Soft click / tap (380Hz)
        osc.type = "sine";
        osc.frequency.setValueAtTime(380, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
        break;
    }
  } catch {
    // Audio autoplay might be blocked before first user touch; safe to ignore
  }
}

export function ScreenFlashOverlay({ alert: alertProp, onDismiss }: ScreenFlashOverlayProps) {
  const [currentAlert, setCurrentAlert] = useState<FlashAlertData | null>(alertProp || null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [visibleToast, setVisibleToast] = useState(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerAlertEffect = useCallback((data: FlashAlertData) => {
    setCurrentAlert(data);
    setIsFlashing(true);
    setVisibleToast(true);

    // 1. Vibrate device according to priority
    triggerPriorityVibration(data.priority);

    // 2. Play synchronized tactical audio cue
    playTacticalCue(data.priority);

    // 3. Screen flash animation duration
    const flashTimer = setTimeout(() => {
      setIsFlashing(false);
    }, 1100);

    // 4. Auto dismiss toast after 3.2 seconds
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setVisibleToast(false);
      setCurrentAlert(null);
      if (onDismiss) onDismiss();
    }, 3400);

    return () => clearTimeout(flashTimer);
  }, [onDismiss]);

  // Listen to external prop change
  useEffect(() => {
    if (alertProp) {
      triggerAlertEffect(alertProp);
    }
  }, [alertProp, triggerAlertEffect]);

  // Listen for global custom events: window.dispatchEvent(new CustomEvent('vulture:flash', { detail: ... }))
  useEffect(() => {
    const handleFlashEvent = (event: CustomEvent<FlashAlertData>) => {
      if (event.detail) {
        triggerAlertEffect(event.detail);
      }
    };

    window.addEventListener("vulture:flash" as any, handleFlashEvent as any);
    return () => {
      window.removeEventListener("vulture:flash" as any, handleFlashEvent as any);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [triggerAlertEffect]);

  if (!currentAlert && !isFlashing && !visibleToast) return null;

  const priority = currentAlert?.priority || "NORMAL";
  const cfg = PRIORITY_CONFIG[priority];

  const flashClass =
    priority === "CRITICAL"
      ? "screen-flash-critical"
      : priority === "HIGH"
      ? "screen-flash-high"
      : priority === "NORMAL"
      ? "screen-flash-normal"
      : "screen-flash-low";

  return (
    <>
      {/* 1. Full-Screen Visual Flash Overlay */}
      {isFlashing && (
        <div
          className={`fixed inset-0 pointer-events-none z-[100] transition-opacity ${flashClass}`}
          style={{
            backgroundColor: cfg.flashBg,
            boxShadow: cfg.glowShadow,
          }}
        >
          {/* Tactical Perimeter Reticles */}
          <div
            className="absolute inset-0 border-2 pointer-events-none"
            style={{ borderColor: cfg.borderColor }}
          >
            {/* Top-left corner */}
            <div
              className="absolute top-3 left-3 w-8 h-8 border-t-4 border-l-4 rounded-tl-lg"
              style={{ borderColor: cfg.borderColor }}
            />
            {/* Top-right corner */}
            <div
              className="absolute top-3 right-3 w-8 h-8 border-t-4 border-r-4 rounded-tr-lg"
              style={{ borderColor: cfg.borderColor }}
            />
            {/* Bottom-left corner */}
            <div
              className="absolute bottom-3 left-3 w-8 h-8 border-b-4 border-l-4 rounded-bl-lg"
              style={{ borderColor: cfg.borderColor }}
            />
            {/* Bottom-right corner */}
            <div
              className="absolute bottom-3 right-3 w-8 h-8 border-b-4 border-r-4 rounded-br-lg"
              style={{ borderColor: cfg.borderColor }}
            />
          </div>
        </div>
      )}

      {/* 2. Tactical Heads-Up Display (HUD) Dropdown Banner */}
      {visibleToast && currentAlert && (
        <div className="fixed top-5 left-4 right-4 z-[101] max-w-lg mx-auto pointer-events-auto">
          <div
            className="relative flex items-center justify-between p-4 rounded-2xl backdrop-blur-2xl border shadow-2xl transition-all animate-in slide-in-from-top-6 duration-300"
            style={{
              backgroundColor: "rgba(12, 14, 21, 0.95)",
              borderColor: cfg.borderColor,
              boxShadow: `0 15px 40px rgba(0,0,0,0.9), 0 0 25px ${cfg.badgeBg}`,
            }}
          >
            <div className="flex items-start gap-3 min-w-0 flex-1 pr-2">
              {/* Pulsing Priority Beacon */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: cfg.badgeBg, border: `1px solid ${cfg.badgeBorder}` }}
              >
                {priority === "CRITICAL" ? (
                  <ShieldAlert className="w-4 h-4 text-[#fda4af] animate-pulse" />
                ) : priority === "HIGH" ? (
                  <AlertTriangle className="w-4 h-4 text-[#fdba74]" />
                ) : (
                  <Radio className="w-4 h-4 text-[#d4f65b]" />
                )}
              </div>

              {/* Text Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="font-mono text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: cfg.badgeBg,
                      color: cfg.badgeText,
                      border: `1px solid ${cfg.badgeBorder}`,
                    }}
                  >
                    {cfg.label}
                  </span>

                  {currentAlert.senderName && (
                    <span className="font-mono text-xs font-bold text-[#f8f8f6] truncate">
                      {currentAlert.senderName}
                    </span>
                  )}

                  {currentAlert.category && (
                    <span className="font-mono text-[10px] text-[#64748b] hidden sm:inline">
                      // {currentAlert.category}
                    </span>
                  )}
                </div>

                <p className="mt-1 font-mono text-xs text-[#cbd5e1] truncate leading-normal">
                  {currentAlert.summary || currentAlert.transcript || "New broadcast transmission received"}
                </p>
              </div>
            </div>

            {/* Dismiss Button */}
            <button
              type="button"
              onClick={() => {
                setVisibleToast(false);
                setCurrentAlert(null);
                if (onDismiss) onDismiss();
              }}
              className="p-1 rounded-lg text-[#64748b] hover:text-[#f8f8f6] hover:bg-[#1a1e2d] transition-colors shrink-0"
              title="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
