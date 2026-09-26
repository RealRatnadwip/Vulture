"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Mic,
  Square,
  Sparkles,
  Radio,
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldAlert,
  Zap,
  Loader2,
  Volume2,
  Cpu,
  RefreshCw,
  Terminal,
} from "lucide-react";
import { PriorityLevel } from "@/lib/validation";
import { triggerPriorityVibration } from "@/lib/utils/hapticsAndAlerts";

interface DemoClassification {
  summary: string;
  priority: PriorityLevel;
  category: string;
  urgencyScore: number;
  expiresInMinutes: number;
}

interface DemoResult {
  transcript: string;
  classification: DemoClassification;
  inputSource: "microphone" | "preset";
  isSttFallback: boolean;
  metrics: {
    sttProvider: string;
    classifierProvider: string;
    durationMs: number;
  };
}

const PRESET_SCENARIOS = [
  {
    label: "Outage",
    priority: "CRITICAL",
    badgeColor: "#FDA4AF",
    text: "Urgent: Primary PostgreSQL connection pool exhausted! Production requests failing across US-East, failover initiated!",
  },
  {
    label: "Schedule",
    priority: "HIGH",
    badgeColor: "#FDBA74",
    text: "Sprint review moved forward to 3:30 PM today. Please have deployment dashboards ready.",
  },
  {
    label: "Status",
    priority: "NORMAL",
    badgeColor: "#D4F65B",
    text: "Frontend v2.4 deployed to staging environment. Feel free to review the new voice interface.",
  },
  {
    label: "Casual",
    priority: "LOW",
    badgeColor: "#7DD3FC",
    text: "Grabbing a coffee downstairs with the infra team, will be back at my desk in 15 minutes.",
  },
];

type DemoState = "IDLE" | "RECORDING" | "TRANSCRIBING" | "CLASSIFYING" | "DONE" | "ERROR";

export function VoiceHeroDemo() {
  const [state, setState] = useState<DemoState>("IDLE");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [result, setResult] = useState<DemoResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  // Clean up recording timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Process voice/text through real ElevenLabs + Gemini API
  const runPipeline = useCallback(async (payload: { audioBlob?: Blob; text?: string }) => {
    setState("TRANSCRIBING");
    setErrorMessage(null);

    try {
      let res: Response;

      if (payload.audioBlob) {
        const formData = new FormData();
        formData.append("audio", payload.audioBlob, "live_demo.webm");

        const classifyStepTimer = setTimeout(() => {
          setState("CLASSIFYING");
        }, 900);

        res = await fetch("/api/demo/voice-pipeline", {
          method: "POST",
          body: formData,
        });

        clearTimeout(classifyStepTimer);
      } else {
        setState("CLASSIFYING");
        res = await fetch("/api/demo/voice-pipeline", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: payload.text }),
        });
      }

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with ${res.status}`);
      }

      const data: DemoResult = await res.json();
      setResult(data);
      setState("DONE");

      // Trigger Screen Flash & Mobile Vibration based on real Gemini priority!
      if (typeof window !== "undefined") {
        triggerPriorityVibration(data.classification.priority);
        window.dispatchEvent(
          new CustomEvent("vulture:flash", {
            detail: {
              id: "demo-" + Date.now(),
              priority: data.classification.priority,
              senderName: "LIVE HERO VOICE DEMO",
              transcript: data.transcript,
              summary: data.classification.summary,
              urgencyScore: data.classification.urgencyScore,
              category: data.classification.category,
            },
          })
        );
      }
    } catch (err: any) {
      console.error("[VoiceHeroDemo] Pipeline error:", err);
      setErrorMessage(err?.message || "Pipeline execution failed. Please try again.");
      setState("ERROR");
    }
  }, []);

  // Start Real Browser Microphone Recording
  const startRecording = async () => {
    setErrorMessage(null);
    setResult(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      audioChunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        if (audioStreamRef.current) {
          audioStreamRef.current.getTracks().forEach((t) => t.stop());
          audioStreamRef.current = null;
        }
        await runPipeline({ audioBlob });
      };

      recorder.start(100);
      setState("RECORDING");
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 12) {
            stopRecording();
            return 12;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.warn("[VoiceHeroDemo] Mic access rejected:", err);
      setErrorMessage("Microphone access was denied. You can still test with preset scenarios below!");
      setState("IDLE");
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  // Trigger Preset Voice Scenario
  const handlePresetSelect = (text: string) => {
    if (state === "RECORDING" || state === "TRANSCRIBING" || state === "CLASSIFYING") return;
    setResult(null);
    runPipeline({ text });
  };

  const isBusy = state === "RECORDING" || state === "TRANSCRIBING" || state === "CLASSIFYING";

  return (
    <div className="w-full rounded-2xl bg-[#0c0d12] border border-[#1e2230] p-5 sm:p-7 relative overflow-hidden text-left shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_12px_40px_rgba(0,0,0,0.6)]">
      {/* Precision Corner Reticles */}
      <span className="absolute top-2.5 left-2.5 text-[9px] font-mono text-[#282d3e] select-none pointer-events-none">+</span>
      <span className="absolute top-2.5 right-2.5 text-[9px] font-mono text-[#282d3e] select-none pointer-events-none">+</span>
      <span className="absolute bottom-2.5 left-2.5 text-[9px] font-mono text-[#282d3e] select-none pointer-events-none">+</span>
      <span className="absolute bottom-2.5 right-2.5 text-[9px] font-mono text-[#282d3e] select-none pointer-events-none">+</span>

      {/* Top Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1a1d28] mb-5">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                state === "RECORDING"
                  ? "bg-[#fda4af] animate-ping"
                  : state === "DONE"
                  ? "bg-[#86efac]"
                  : "bg-[#d4f65b] animate-pulse"
              }`}
            />
            <span
              className={`w-2 h-2 rounded-full absolute ${
                state === "RECORDING"
                  ? "bg-[#fda4af]"
                  : state === "DONE"
                  ? "bg-[#86efac]"
                  : "bg-[#d4f65b]"
              }`}
            />
          </div>
          <span className="text-xs font-mono font-bold tracking-widest text-[#f8f8f6] uppercase">
            VOICE_PIPELINE // HARVESTER_DEMO
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#94a3b8] bg-[#11131b] px-2.5 py-1 rounded-full border border-[#1e2230] flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-[#ddd6fe]" />
            <span>ELEVENLABS + GEMINI</span>
          </span>
          <span className="text-[10px] font-mono text-[#86efac] bg-[#101a14] px-2.5 py-0.5 rounded-full border border-[#1b3524] font-semibold">
            LIVE API
          </span>
        </div>
      </div>

      {/* Main Interaction Area */}
      <div className="flex flex-col lg:flex-row items-stretch gap-4">
        {/* Left: Interactive Mic Trigger */}
        <div className="flex flex-col gap-2.5 sm:w-64 shrink-0">
          {state === "RECORDING" ? (
            <button
              type="button"
              onClick={stopRecording}
              className="w-full px-5 py-4 rounded-xl border font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all bg-[#fda4af]/20 border-[#fda4af] text-[#fda4af] hover:bg-[#fda4af]/30 shadow-[0_0_30px_rgba(253,164,175,0.3)] animate-pulse cursor-pointer"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>STOP & CLASSIFY ({recordingSeconds}s)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={startRecording}
              disabled={isBusy}
              className="w-full px-5 py-4 rounded-xl border font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all bg-[#10121a] border-[#1e2230] hover:border-[#d4f65b]/80 text-[#f8f8f6] hover:bg-[#141722] hover:shadow-[0_0_25px_rgba(212,246,91,0.2)] cursor-pointer disabled:opacity-50"
            >
              <Mic className="w-4 h-4 text-[#d4f65b]" />
              <span>RECORD YOUR VOICE</span>
            </button>
          )}

          <p className="text-[11px] font-mono text-[#94a3b8] text-center">
            {state === "RECORDING"
              ? "Speaking now... Tap to finish."
              : "Speak once — AI extracts signal & urgency."}
          </p>
        </div>

        {/* Middle/Right: Audio Waveform & Real-Time Pipeline Progress */}
        <div className="flex-1 bg-[#090a0f] p-4 rounded-xl border border-[#191c28] flex flex-col justify-between min-h-[96px]">
          {/* Animated visual state bar */}
          <div className="flex items-center gap-3">
            {/* Dynamic Multi-Pastel Wave Bars */}
            <div className="flex items-center gap-1.5 h-6 shrink-0">
              <span
                className={`w-1.5 rounded-full transition-all ${
                  state === "RECORDING"
                    ? "bg-[#d4f65b] wave-bar-1"
                    : isBusy
                    ? "bg-[#d4f65b] wave-bar-3 opacity-70"
                    : "bg-[#1c1f2b] h-2"
                }`}
              />
              <span
                className={`w-1.5 rounded-full transition-all ${
                  state === "RECORDING"
                    ? "bg-[#7dd3fc] wave-bar-2"
                    : isBusy
                    ? "bg-[#7dd3fc] wave-bar-4 opacity-70"
                    : "bg-[#1c1f2b] h-4"
                }`}
              />
              <span
                className={`w-1.5 rounded-full transition-all ${
                  state === "RECORDING"
                    ? "bg-[#ddd6fe] wave-bar-3"
                    : isBusy
                    ? "bg-[#ddd6fe] wave-bar-2 opacity-70"
                    : "bg-[#1c1f2b] h-3"
                }`}
              />
              <span
                className={`w-1.5 rounded-full transition-all ${
                  state === "RECORDING"
                    ? "bg-[#fba4af] wave-bar-4"
                    : isBusy
                    ? "bg-[#fba4af] wave-bar-5 opacity-70"
                    : "bg-[#1c1f2b] h-5"
                }`}
              />
              <span
                className={`w-1.5 rounded-full transition-all ${
                  state === "RECORDING"
                    ? "bg-[#86efac] wave-bar-5"
                    : isBusy
                    ? "bg-[#86efac] wave-bar-1 opacity-70"
                    : "bg-[#1c1f2b] h-2"
                }`}
              />
            </div>

            {/* Dynamic Status Text */}
            <div className="text-xs font-mono text-[#94a3b8] truncate flex-1">
              {state === "RECORDING" ? (
                <span className="text-[#fda4af] flex items-center gap-1.5 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fda4af] animate-ping" />
                  Streaming live speech input [{recordingSeconds}s]...
                </span>
              ) : state === "TRANSCRIBING" ? (
                <span className="text-[#d4f65b] flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#d4f65b]" />
                  [1/2] ElevenLabs Scribe converting audio to tokens...
                </span>
              ) : state === "CLASSIFYING" ? (
                <span className="text-[#ddd6fe] flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ddd6fe]" />
                  [2/2] Google Gemini inferring urgency & half-life window...
                </span>
              ) : state === "DONE" ? (
                <span className="text-[#86efac] flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#86efac]" />
                  Triage Complete in {result?.metrics.durationMs}ms
                </span>
              ) : (
                <span className="text-[#64748b]">
                  Ready. Record audio or click a preset below for instant AI classification.
                </span>
              )}
            </div>
          </div>

          {/* Quick preset scenario buttons with Bright Pastel Accents */}
          <div className="mt-3 pt-3 border-t border-[#161822] flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono text-[#64748b] uppercase mr-1">
              Sample Scenarios:
            </span>
            {PRESET_SCENARIOS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetSelect(preset.text)}
                disabled={isBusy}
                className="px-2.5 py-1 rounded-full bg-[#0c0d13] hover:bg-[#12141c] border border-[#1c202d] hover:border-[#2d3348] text-[11px] font-mono text-[#cbd5e1] hover:text-[#f8f8f6] transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: preset.badgeColor }}
                />
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="mt-4 p-3.5 bg-[#25151b] border border-[#4d232c] rounded-xl flex items-center gap-2 text-xs font-mono text-[#fda4af]">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Live Result Card (Returned by Real Gemini API) */}
      {result && (
        <div className="mt-5 p-5 rounded-xl bg-[#090a0f] border border-[#1e2230] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-[#161824] mb-3.5">
            <div className="flex items-center gap-2">
              {result.classification.priority === "CRITICAL" ? (
                <ShieldAlert className="w-4 h-4 text-[#fda4af]" />
              ) : result.classification.priority === "HIGH" ? (
                <AlertTriangle className="w-4 h-4 text-[#fdba74]" />
              ) : (
                <Radio className="w-4 h-4 text-[#d4f65b]" />
              )}
              <span
                className="font-mono text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor:
                    result.classification.priority === "CRITICAL"
                      ? "rgba(253,164,175,0.18)"
                      : result.classification.priority === "HIGH"
                      ? "rgba(253,186,116,0.18)"
                      : "rgba(212,246,91,0.15)",
                  color:
                    result.classification.priority === "CRITICAL"
                      ? "#fda4af"
                      : result.classification.priority === "HIGH"
                      ? "#fdba74"
                      : "#d4f65b",
                  border: `1px solid ${
                    result.classification.priority === "CRITICAL"
                      ? "rgba(253,164,175,0.4)"
                      : result.classification.priority === "HIGH"
                      ? "rgba(253,186,116,0.4)"
                      : "rgba(212,246,91,0.35)"
                  }`,
                }}
              >
                {result.classification.priority} // {result.classification.category}
              </span>

              <span className="font-mono text-xs text-[#94a3b8]">
                URGENCY:{" "}
                <span className="text-[#f8f8f6] font-bold">
                  {result.classification.urgencyScore}/100
                </span>
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono text-[#94a3b8]">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#0c0d12] border border-[#1c202d]">
                <Clock className="w-3 h-3 text-[#d4f65b]" />
                HALF-LIFE: {result.classification.expiresInMinutes}m
              </span>
              <span>// {result.metrics.durationMs}ms</span>
            </div>
          </div>

          {/* AI Summary and Spoken Words */}
          <div className="space-y-2.5">
            <div className="p-3 rounded-lg bg-[#0c0d12] border border-[#1a1d28]">
              <span className="font-mono text-[10px] text-[#ddd6fe] uppercase font-bold tracking-wider block mb-1">
                Gemini 3.5 Triage Summary:
              </span>
              <p className="font-mono text-sm text-[#f8f8f6] font-semibold leading-relaxed">
                &ldquo;{result.classification.summary}&rdquo;
              </p>
            </div>

            <div className="px-3 pt-1">
              <span className="font-mono text-[10px] text-[#64748b] uppercase block mb-0.5">
                ElevenLabs Speech-To-Text Output:
              </span>
              <p className="font-mono text-xs text-[#94a3b8] italic">
                {result.transcript}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
