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

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      // Determine supported mime type
      let mimeType = "audio/webm";
      if (!MediaRecorder.isTypeSupported("audio/webm")) {
        if (MediaRecorder.isTypeSupported("audio/mp4")) mimeType = "audio/mp4";
        else if (MediaRecorder.isTypeSupported("audio/ogg")) mimeType = "audio/ogg";
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const recordedBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const recordedMs = Date.now() - startTimeRef.current;

        // Stop all tracks to release mic hardware
        stream.getTracks().forEach((track) => track.stop());

        if (recordedMs < 600) {
          setErrorMsg("Hold longer to speak (minimum 0.6s)");
          setState("IDLE");
          return;
        }

        sendAudioToServer(recordedBlob, recordedMs);
      };

      recorder.start(100);
      startTimeRef.current = Date.now();
      setState("RECORDING");
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 200);
    } catch (err: unknown) {
      console.warn("[MicrophoneButton] Permission error:", err);
      const isDenied = err instanceof DOMException && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError");
      setErrorMsg(
        isDenied
          ? "Microphone access blocked. Enable permissions or use the simulator below."
          : "Microphone unavailable on this device."
      );
      setState("IDLE");
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  // Mouse handlers
  const handleMouseDown = () => {
    isHoldingRef.current = true;
    startRecording();
  };

  const handleMouseUp = () => {
    if (isHoldingRef.current && state === "RECORDING") {
      isHoldingRef.current = false;
      stopRecording();
    }
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
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
    <div className="flex flex-col items-center gap-3 w-full max-w-md mx-auto py-2">
      {/* Error alert if any */}
      {errorMsg && (
        <div className="flex items-center gap-2 text-xs text-[#ff6b6b] bg-[#221010] border border-[#441a1a] px-3 py-1.5 rounded w-full justify-between animate-in fade-in">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            className="text-[10px] text-[#ff8e8e] hover:underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Microphone Button */}
      <div className="relative flex flex-col items-center">
        {/* Pulsing ring during recording */}
        {state === "RECORDING" && (
          <div className="absolute inset-0 -m-3 rounded-full bg-[#d7f24a]/20 mic-recording-ring pointer-events-none" />
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
          className={`relative group w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all select-none focus:outline-none focus:ring-2 focus:ring-[#d7f24a]/40 ${
            state === "RECORDING"
              ? "bg-[#d7f24a] text-[#0e0e0e] shadow-[0_0_25px_rgba(215,242,74,0.4)] scale-105"
              : isBusy
              ? "bg-[#181818] border border-[#2d2d2d] text-[#d7f24a] cursor-wait"
              : "bg-[#161616] border border-[#2d2d2d] hover:border-[#444444] text-[#e0e0e0] hover:text-[#f1f1ef] active:scale-95"
          }`}
        >
          {isBusy ? (
            <Loader2 className="w-7 h-7 animate-spin text-[#d7f24a]" />
          ) : (
            <Mic
              className={`w-7 h-7 transition-transform ${
                state === "RECORDING" ? "scale-110 text-[#0e0e0e]" : "text-[#d7f24a] group-hover:scale-105"
              }`}
            />
          )}

          {state === "RECORDING" && (
            <span className="font-mono text-[10px] font-bold text-[#0e0e0e] mt-0.5">
              {formatTimer(duration)}
            </span>
          )}
        </button>

        {/* State Label */}
        <div className="mt-2 text-center h-5">
          {state === "IDLE" && (
            <span className="text-xs font-mono text-[#888888] tracking-wide uppercase">
              hold to speak
            </span>
          )}
          {state === "RECORDING" && (
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#d7f24a]">
              <span className="inline-block w-2 h-2 rounded-full bg-[#ff453a] animate-pulse" />
              <span>recording broadcast...</span>
            </div>
          )}
          {state === "PROCESSING" && (
            <span className="text-xs font-mono text-[#999999] animate-pulse">
              processing voice...
            </span>
          )}
          {state === "TRANSCRIBING" && (
            <span className="text-xs font-mono text-[#999999] animate-pulse">
              transcribing voice...
            </span>
          )}
          {state === "CLASSIFYING" && (
            <span className="text-xs font-mono text-[#d7f24a] animate-pulse">
              finding the signal...
            </span>
          )}
        </div>
      </div>

      {/* Demo audio selector */}
      <DemoAudioSelector onSelectTranscript={sendTranscriptToServer} disabled={isBusy} />
    </div>
  );
}
