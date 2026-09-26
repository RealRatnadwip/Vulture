"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Mic, AlertCircle, Loader2, ArrowUp, Square, Radio, Sparkles } from "lucide-react";
import { DemoAudioSelector } from "./DemoAudioSelector";

interface MicrophoneButtonProps {
  groupId: string;
  onMessageBroadcasted: (message: any) => void;
  disabled?: boolean;
}

type RecordingState = "IDLE" | "RECORDING" | "PROCESSING" | "TRANSCRIBING" | "CLASSIFYING";

export function MicrophoneButton({ groupId, onMessageBroadcasted, disabled }: MicrophoneButtonProps) {
  const [state, setState] = useState<RecordingState>("IDLE");
  const [duration, setDuration] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const isHoldingRef = useRef<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const sendAudioToServer = useCallback(async (audioBlob: Blob, recordingDurationMs: number) => {
    if (audioBlob.size < 600 || recordingDurationMs < 400) {
      setErrorMsg("Audio too short — please speak for at least 1 second.");
      setState("IDLE");
      return;
    }

    setState("PROCESSING");
    setErrorMsg(null);

    try {
      setState("TRANSCRIBING");

      const formData = new FormData();
      formData.append("audio", audioBlob, "broadcast.webm");
      formData.append("groupId", groupId);
      formData.append("durationMs", String(recordingDurationMs));

      setState("CLASSIFYING");

      const res = await fetch("/api/messages/create", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server responded with ${res.status}`);
      }

      const createdMessage = await res.json();
      onMessageBroadcasted(createdMessage);
      setState("IDLE");
    } catch (err: unknown) {
      console.error("[MicrophoneButton] Broadcast error:", err);
      const msg = err instanceof Error ? err.message : "Failed to broadcast voice";
      setErrorMsg(msg);
      setState("IDLE");
    }
  }, [groupId, onMessageBroadcasted]);

  const sendTranscriptToServer = useCallback(async (transcriptText: string) => {
    setState("CLASSIFYING");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/messages/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId,
          transcript: transcriptText,
          durationMs: 3000,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server responded with ${res.status}`);
      }

      const createdMessage = await res.json();
      onMessageBroadcasted(createdMessage);
      setTextInput("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Broadcast failed";
      setErrorMsg(msg);
    } finally {
      setState("IDLE");
    }
  }, [groupId, onMessageBroadcasted]);

  const handleTextSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = textInput.trim();
    if (!trimmed || isBusy || state === "RECORDING") return;
    sendTranscriptToServer(trimmed);
  };

  const startRecording = async () => {
    if (disabled || state !== "IDLE") return;
    setErrorMsg(null);

    // Tactile haptic pulse on record start
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try { navigator.vibrate(45); } catch {}
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const recordingDuration = Date.now() - startTimeRef.current;

        // Stop all tracks on the stream to release hardware mic
        stream.getTracks().forEach((track) => track.stop());

        sendAudioToServer(audioBlob, recordingDuration);
      };

      mediaRecorder.start(100);
      startTimeRef.current = Date.now();
      setState("RECORDING");
      setDuration(0);

      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setDuration(elapsed);

        // Auto-stop at 30 seconds
        if (elapsed >= 30) {
          stopRecording();
        }
      }, 500);
    } catch (err: unknown) {
      console.error("[MicrophoneButton] Mic access error:", err);
      const msg = err instanceof Error ? err.message : "Microphone permission denied";
      setErrorMsg(msg);
      setState("IDLE");
      isHoldingRef.current = false;
    }
  };

  const stopRecording = () => {
    if (state !== "RECORDING") return;

    // Tactile haptic pulse on record stop
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try { navigator.vibrate(25); } catch {}
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const pressStartRef = useRef<number>(0);

  const handlePointerDown = () => {
    if (disabled || state !== "IDLE") return;
    pressStartRef.current = Date.now();
    isHoldingRef.current = true;
    startRecording();
  };

  const handlePointerUp = () => {
    const elapsed = Date.now() - pressStartRef.current;
    if (isHoldingRef.current && state === "RECORDING") {
      isHoldingRef.current = false;
      // If held for >= 500ms, stop on release (push-to-talk)
      if (elapsed >= 500) {
        stopRecording();
      }
      // If quick tap (< 500ms), keep recording until user taps FINISH
    }
  };

  const handleMicClick = () => {
    if (state === "RECORDING") {
      stopRecording();
    }
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isBusy = state === "PROCESSING" || state === "TRANSCRIBING" || state === "CLASSIFYING";

  return (
    <div className="flex flex-col items-center gap-2.5 w-full max-w-2xl mx-auto">
      {/* Error alert if any */}
      {errorMsg && (
        <div className="flex items-center gap-2 text-xs font-mono text-[#fda4af] bg-[#25151b] border border-[#4d232c] px-3.5 py-1.5 rounded-xl w-full justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="text-[10px] text-[#fda4af] hover:underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Unified Input Dock: Text Field alongside Mic Icon */}
      <div className="relative w-full rounded-2xl bg-[#0c0d12] border border-[#1e2230] focus-within:border-[#d4f65b]/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_10px_35px_rgba(0,0,0,0.5)] transition-all p-1.5 sm:p-2 flex items-center gap-2">
        {state === "RECORDING" ? (
          /* Active Recording State inside the input bar */
          <div className="flex-1 flex items-center justify-between px-3 py-1.5 animate-in fade-in">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#fda4af] animate-ping" />
              <span className="font-mono text-xs font-bold text-[#fda4af] uppercase tracking-wider">
                RECORDING [{formatTimer(duration)}]
              </span>
              {/* Dynamic waveform bars */}
              <div className="flex items-center gap-1 h-5">
                <span className="w-1 bg-[#d4f65b] wave-bar-1 rounded-full" />
                <span className="w-1 bg-[#7dd3fc] wave-bar-2 rounded-full" />
                <span className="w-1 bg-[#ddd6fe] wave-bar-3 rounded-full" />
                <span className="w-1 bg-[#fda4af] wave-bar-4 rounded-full" />
                <span className="w-1 bg-[#86efac] wave-bar-5 rounded-full" />
              </div>
            </div>
            <span className="text-[11px] font-mono text-[#94a3b8] hidden sm:inline">
              Tap finish or release to broadcast
            </span>
          </div>
        ) : isBusy ? (
          /* Processing / AI Classification State inside the input bar */
          <div className="flex-1 flex items-center gap-2.5 px-3 py-1.5 font-mono text-xs text-[#94a3b8]">
            <Loader2 className="w-4 h-4 animate-spin text-[#d4f65b]" />
            <span className="truncate">
              {state === "TRANSCRIBING"
                ? "[1/2] ElevenLabs Scribe converting audio..."
                : state === "CLASSIFYING"
                ? "[2/2] Google Gemini inferring urgency & half-life..."
                : "Broadcasting to squad channel..."}
            </span>
          </div>
        ) : (
          /* UI-Friendly Text Input Field alongside Mic */
          <form onSubmit={handleTextSubmit} className="flex-1 flex items-center gap-2 pl-2">
            <div className="w-7 h-7 rounded-lg bg-[#11131b] border border-[#1e2230] flex items-center justify-center text-[#d4f65b] shrink-0">
              <Radio className="w-3.5 h-3.5" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              disabled={disabled || isBusy}
              placeholder="Type a broadcast message or hold mic to speak..."
              className="flex-1 bg-transparent text-xs font-mono text-[#f8f8f6] placeholder-[#64748b] focus:outline-none py-1.5"
            />
          </form>
        )}

        {/* Action Buttons: Send & Mic */}
        <div className="flex items-center gap-1.5 shrink-0 pr-1">
          {/* Send Button (Visible when text is typed) */}
          {textInput.trim().length > 0 && state === "IDLE" && (
            <button
              type="button"
              onClick={handleTextSubmit}
              disabled={disabled || isBusy}
              title="Send broadcast message (Enter)"
              className="h-9 px-3 rounded-xl bg-[#d4f65b] text-[#08090b] font-mono font-bold text-xs hover:bg-[#c3e848] transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(212,246,91,0.25)] animate-in fade-in zoom-in-95 cursor-pointer"
            >
              <span>SEND</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Microphone Button (Alongside the text field) */}
          {state === "RECORDING" ? (
            <button
              type="button"
              onClick={stopRecording}
              className="h-9 px-3.5 rounded-xl bg-[#fda4af] text-[#08090b] font-mono font-bold text-xs hover:bg-[#fca5a5] transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(253,164,175,0.4)] animate-pulse cursor-pointer"
              title="Finish & Send Voice Broadcast"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>FINISH</span>
            </button>
          ) : (
            <button
              type="button"
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onClick={handleMicClick}
              disabled={disabled || isBusy}
              title="Click or hold to broadcast voice"
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                isBusy
                  ? "bg-[#10121a] border border-[#1e2230] text-[#64748b] cursor-wait"
                  : "bg-[#10121a] hover:bg-[#151822] text-[#d4f65b] border border-[#1e2230] hover:border-[#d4f65b]/60 hover:shadow-[0_0_15px_rgba(212,246,91,0.2)] active:scale-95"
              }`}
            >
              <Mic className="w-4 h-4 text-[#d4f65b]" />
            </button>
          )}
        </div>
      </div>

      {/* Demo preset audio selector for testing */}
      <DemoAudioSelector onSelectTranscript={sendTranscriptToServer} disabled={isBusy} />
    </div>
  );
}
