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
    badgeColor: "#ff453a",
    text: "Urgent: Primary PostgreSQL connection pool exhausted! Production requests failing across US-East, failover initiated!",
  },
  {
    label: "Schedule",
    priority: "HIGH",
    badgeColor: "#ff9f0a",
    text: "Sprint review moved forward to 3:30 PM today. Please have deployment dashboards ready.",
  },
  {
    label: "Status",
    priority: "NORMAL",
    badgeColor: "#d7f24a",
    text: "Frontend v2.4 deployed to staging environment. Feel free to review the new voice interface.",
  },
  {
    label: "Casual",
    priority: "LOW",
    badgeColor: "#64d2ff",
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

        // Small visual delay indicator for Gemini step
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
            // Auto-stop after 12 seconds for safety
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
    <div className="w-full rounded-2xl bg-[#121212]/95 border border-[#262626] p-4 sm:p-6 relative overflow-hidden text-left shadow-2xl backdrop-blur-xl">
      {/* Top Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-[#202020] mb-4">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                state === "RECORDING"
                  ? "bg-[#ff453a] animate-ping"
                  : state === "DONE"
                  ? "bg-[#34c759]"
                  : "bg-[#d7f24a] animate-pulse"
              }`}
            />
            <span
              className={`w-2 h-2 rounded-full absolute ${
                state === "RECORDING"
                  ? "bg-[#ff453a]"
                  : state === "DONE"
                  ? "bg-[#34c759]"
                  : "bg-[#d7f24a]"
              }`}
            />
          </div>
          <span className="text-xs font-mono font-bold text-[#f1f1ef] uppercase tracking-wider">
            VOICE_PIPELINE // LIVE_API_TEST
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#888888] bg-[#181818] px-2 py-0.5 rounded border border-[#2b2b2b] flex items-center gap-1">
            <Cpu className="w-3 h-3 text-[#d7f24a]" />
            ELEVENLABS + GEMINI 3.5
          </span>
          <span className="text-[10px] font-mono text-[#34c759] bg-[#152418] px-2 py-0.5 rounded border border-[#27442d]">
            ONLINE
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
              className="w-full px-5 py-4 rounded-xl border font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all bg-[#ff453a]/25 border-[#ff453a] text-[#ff453a] hover:bg-[#ff453a]/35 shadow-[0_0_25px_rgba(255,69,58,0.35)] animate-pulse cursor-pointer"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>STOP & CLASSIFY ({recordingSeconds}s)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={startRecording}
              disabled={isBusy}
              className="w-full px-5 py-4 rounded-xl border font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all bg-[#1b1b1b] border-[#333333] hover:border-[#d7f24a] text-[#f1f1ef] hover:bg-[#222222] shadow-[0_0_20px_rgba(0,0,0,0.5)] cursor-pointer disabled:opacity-50"
            >
              <Mic className="w-4 h-4 text-[#d7f24a]" />
              <span>RECORD YOUR VOICE</span>
            </button>
          )}

          <p className="text-[11px] font-mono text-[#666666] text-center">
            {state === "RECORDING"
              ? "Speaking now... Tap to end."
              : "Speak freely — Gemini will rate urgency."}
          </p>
        </div>

        {/* Middle/Right: Audio Waveform & Real-Time Pipeline Progress */}
        <div className="flex-1 bg-[#0c0c0c] p-4 rounded-xl border border-[#202020] flex flex-col justify-between min-h-[90px]">
          {/* Animated visual state bar */}
          <div className="flex items-center gap-3">
            {/* Audio Wave Bars */}
            <div className="flex items-center gap-1 h-6 shrink-0">
              <span
                className={`w-1 bg-[#d7f24a] rounded-full transition-all ${
                  state === "RECORDING" ? "wave-bar-1" : isBusy ? "wave-bar-3 opacity-60" : "h-2 opacity-30"
                }`}
              />
              <span
                className={`w-1 bg-[#d7f24a] rounded-full transition-all ${
                  state === "RECORDING" ? "wave-bar-2" : isBusy ? "wave-bar-4 opacity-60" : "h-4 opacity-30"
                }`}
              />
              <span
                className={`w-1 bg-[#d7f24a] rounded-full transition-all ${
                  state === "RECORDING" ? "wave-bar-3" : isBusy ? "wave-bar-2 opacity-60" : "h-3 opacity-30"
                }`}
              />
              <span
                className={`w-1 bg-[#d7f24a] rounded-full transition-all ${
                  state === "RECORDING" ? "wave-bar-4" : isBusy ? "wave-bar-5 opacity-60" : "h-5 opacity-30"
                }`}
              />
              <span
                className={`w-1 bg-[#d7f24a] rounded-full transition-all ${
                  state === "RECORDING" ? "wave-bar-5" : isBusy ? "wave-bar-1 opacity-60" : "h-2 opacity-30"
                }`}
              />
            </div>

            {/* Dynamic Status Text */}
            <div className="text-xs font-mono text-[#888888] truncate flex-1">
              {state === "RECORDING" ? (
                <span className="text-[#ff453a] flex items-center gap-1.5 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff453a] animate-ping" />
                  Capturing raw audio stream [{recordingSeconds}s]...
                </span>
              ) : state === "TRANSCRIBING" ? (
                <span className="text-[#d7f24a] flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#d7f24a]" />
                  [1/2] ElevenLabs Scribe converting audio to tokens...
                </span>
              ) : state === "CLASSIFYING" ? (
                <span className="text-[#64d2ff] flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#64d2ff]" />
                  [2/2] Google Gemini inferring urgency & half-life window...
                </span>
              ) : state === "DONE" ? (
                <span className="text-[#34c759] flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#34c759]" />
                  Triage Complete ({result?.metrics.durationMs}ms)
                </span>
              ) : (
                <span className="text-[#666666]">
                  Ready. Record audio or click a tactical preset below to run live API test.
                </span>
              )}
            </div>
          </div>

          {/* Quick preset scenario buttons */}
          <div className="mt-3 pt-3 border-t border-[#1a1a1a] flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono text-[#666666] uppercase mr-1">
              Live Presets:
            </span>
            {PRESET_SCENARIOS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetSelect(preset.text)}
                disabled={isBusy}
                className="px-2 py-0.5 rounded bg-[#161616] hover:bg-[#202020] border border-[#2b2b2b] hover:border-[#444444] text-[11px] font-mono text-[#cccccc] hover:text-[#f1f1ef] transition-colors flex items-center gap-1 disabled:opacity-50"
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
        <div className="mt-4 p-3 bg-[#241212] border border-[#441a1a] rounded-xl flex items-center gap-2 text-xs font-mono text-[#ff8075]">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Live Result Card (Returned by Real Gemini API) */}
      {result && (
        <div className="mt-5 p-4 rounded-xl bg-[#0e0e0e] border border-[#2e2e2e] shadow-xl animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#202020] mb-3">
            <div className="flex items-center gap-2">
              {result.classification.priority === "CRITICAL" ? (
                <ShieldAlert className="w-4 h-4 text-[#ff453a]" />
              ) : result.classification.priority === "HIGH" ? (
                <AlertTriangle className="w-4 h-4 text-[#ff9f0a]" />
              ) : (
                <Radio className="w-4 h-4 text-[#d7f24a]" />
              )}
              <span
                className="font-mono text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                style={{
                  backgroundColor:
                    result.classification.priority === "CRITICAL"
                      ? "rgba(255,69,58,0.2)"
                      : result.classification.priority === "HIGH"
                      ? "rgba(255,159,10,0.2)"
                      : "rgba(215,242,74,0.15)",
                  color:
                    result.classification.priority === "CRITICAL"
                      ? "#ff453a"
                      : result.classification.priority === "HIGH"
                      ? "#ff9f0a"
                      : "#d7f24a",
                  border: `1px solid ${
                    result.classification.priority === "CRITICAL"
                      ? "rgba(255,69,58,0.4)"
                      : result.classification.priority === "HIGH"
                      ? "rgba(255,159,10,0.4)"
                      : "rgba(215,242,74,0.3)"
                  }`,
                }}
              >
                {result.classification.priority} // {result.classification.category}
              </span>

              <span className="font-mono text-xs text-[#888888]">
                URGENCY:{" "}
                <span className="text-[#f1f1ef] font-bold">
                  {result.classification.urgencyScore}/100
                </span>
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono text-[#777777]">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#d7f24a]" />
                HALF-LIFE: {result.classification.expiresInMinutes}m
              </span>
              <span>// {result.metrics.durationMs}ms</span>
            </div>
          </div>

          {/* AI Summary and Spoken Words */}
          <div className="space-y-2">
            <div>
              <span className="font-mono text-[10px] text-[#777777] uppercase block mb-0.5">
                Gemini 3.5 Triage Summary:
              </span>
              <p className="font-mono text-sm text-[#f1f1ef] font-semibold">
                &ldquo;{result.classification.summary}&rdquo;
              </p>
            </div>

            <div className="pt-2 border-t border-[#1a1a1a]">
              <span className="font-mono text-[10px] text-[#555555] uppercase block mb-0.5">
                Speech-To-Text Raw Transcript:
              </span>
              <p className="font-mono text-xs text-[#999999] italic">
                {result.transcript}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
