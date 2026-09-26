"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Mic, AlertCircle, Loader2 } from "lucide-react";
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

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const isHoldingRef = useRef<boolean>(false);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const sendAudioToServer = useCallback(async (audioBlob: Blob, recordingDurationMs: number) => {
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Broadcast failed";
      setErrorMsg(msg);
    } finally {
      setState("IDLE");
    }
  }, [groupId, onMessageBroadcasted]);

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

  const handleMouseDown = () => {
    if (disabled || state !== "IDLE") return;
    isHoldingRef.current = true;
    startRecording();
  };

  const handleMouseUp = () => {
    if (isHoldingRef.current && state === "RECORDING") {
      isHoldingRef.current = false;
      stopRecording();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (disabled || state !== "IDLE") return;
    isHoldingRef.current = true;
    startRecording();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    if (isHoldingRef.current && state === "RECORDING") {
      isHoldingRef.current = false;
      stopRecording();
    }
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === "Space" && state === "IDLE" && !isHoldingRef.current) {
      e.preventDefault();
      isHoldingRef.current = true;
      startRecording();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.code === "Space" && state === "RECORDING") {
      e.preventDefault();
      isHoldingRef.current = false;
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
    <div className="flex flex-col items-center gap-2.5 w-full max-w-md mx-auto">
      {/* Error alert if any */}
      {errorMsg && (
        <div className="flex items-center gap-2 text-xs font-mono text-[#fda4af] bg-[#25151b] border border-[#4d232c] px-3.5 py-1.5 rounded-xl w-full justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            className="text-[10px] text-[#fda4af] hover:underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Microphone Button */}
      <div className="relative flex flex-col items-center">
        {/* Pulsing ring during recording */}
        {state === "RECORDING" && (
          <div className="absolute inset-0 -m-3 rounded-full bg-[#d4f65b]/25 mic-recording-ring pointer-events-none" />
        )}

        <button
          type="button"
          aria-label="Hold to speak voice broadcast"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          disabled={disabled || isBusy}
          className={`relative group w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all select-none focus:outline-none focus:ring-2 focus:ring-[#d4f65b]/50 ${
            state === "RECORDING"
              ? "bg-[#d4f65b] text-[#08090b] shadow-[0_0_35px_rgba(212,246,91,0.5)] scale-105"
              : isBusy
              ? "bg-[#141724] border border-[#2b3147] text-[#d4f65b] cursor-wait"
              : "bg-[#12141e] border border-[#282d40] hover:border-[#d4f65b]/60 text-[#f8f8f6] hover:shadow-[0_0_20px_rgba(212,246,91,0.18)] active:scale-95"
          }`}
        >
          {isBusy ? (
            <Loader2 className="w-7 h-7 animate-spin text-[#d4f65b]" />
          ) : (
            <Mic
              className={`w-7 h-7 transition-transform ${
                state === "RECORDING" ? "scale-110 text-[#08090b]" : "text-[#d4f65b] group-hover:scale-105"
              }`}
            />
          )}

          {state === "RECORDING" && (
            <span className="font-mono text-[10px] font-bold text-[#08090b] mt-0.5">
              {formatTimer(duration)}
            </span>
          )}
        </button>

        {/* State Label */}
        <div className="mt-2 text-center h-5">
          {state === "IDLE" && (
            <span className="text-[11px] font-mono text-[#94a3b8] tracking-widest uppercase">
              hold to broadcast
            </span>
          )}
          {state === "RECORDING" && (
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#d4f65b] font-bold">
              <span className="inline-block w-2 h-2 rounded-full bg-[#fda4af] animate-pulse" />
              <span>recording broadcast...</span>
            </div>
          )}
          {state === "PROCESSING" && (
            <span className="text-xs font-mono text-[#94a3b8] animate-pulse">
              processing audio...
            </span>
          )}
          {state === "TRANSCRIBING" && (
            <span className="text-xs font-mono text-[#d4f65b] animate-pulse">
              transcribing speech...
            </span>
          )}
          {state === "CLASSIFYING" && (
            <span className="text-xs font-mono text-[#ddd6fe] animate-pulse">
              Gemini inferring urgency...
            </span>
          )}
        </div>
      </div>

      {/* Demo preset audio selector */}
      <DemoAudioSelector onSelectTranscript={sendTranscriptToServer} disabled={isBusy} />
    </div>
  );
}
