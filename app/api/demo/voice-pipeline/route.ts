import { NextRequest, NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/elevenlabs/stt";
import { classifyBroadcast } from "@/lib/ai/gemini";

export const maxDuration = 45;

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    let transcript = "";
    let isSttFallback = false;
    let inputSource: "microphone" | "preset" = "preset";

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const audioFile = formData.get("audio") as Blob | File | null;
      const rawText = formData.get("text") as string | null;

      if (audioFile && audioFile.size > 0) {
        inputSource = "microphone";
        const buffer = Buffer.from(await audioFile.arrayBuffer());
        const mimeType = audioFile.type || "audio/webm";

        const sttResult = await transcribeAudio(buffer, mimeType);
        transcript = sttResult.transcript;
        isSttFallback = sttResult.isFallback || false;
      } else if (rawText && rawText.trim()) {
        transcript = rawText.trim();
      }
    } else {
      const body = await req.json().catch(() => ({}));
      transcript = body.text || body.transcript || "";
    }

    if (!transcript || transcript.trim() === "") {
      transcript = "Alert: Main database connection pool exhausted. Production traffic failing over to secondary replica.";
    }

    // Call real Google Gemini classification engine
    const classification = await classifyBroadcast(transcript, {
      groupName: "Alpha Operations (Landing Demo)",
      recentMessages: [
        { sender: "Ops Lead", transcript: "All systems green for evening deployment.", priority: "LOW" },
        { sender: "SRE On-Call", transcript: "Latency spiking on US-East API gateways.", priority: "HIGH" },
      ],
    });

    const elapsed = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      transcript,
      classification,
      inputSource,
      isSttFallback,
      metrics: {
        sttProvider: "ElevenLabs Scribe v1",
        classifierProvider: "Google Gemini 3.5 Flash",
        durationMs: elapsed,
      },
    });
  } catch (error: any) {
    console.error("[POST /api/demo/voice-pipeline] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to process voice pipeline",
      },
      { status: 500 }
    );
  }
}
