import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { transcribeAudio } from "@/lib/elevenlabs/stt";

export const maxDuration = 30; // 30 seconds max execution time for Vercel/serverless

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio") as Blob | File | null;

    if (!audioFile) {
      return NextResponse.json({ error: "Missing audio payload" }, { status: 400 });
    }

    // Validate size (max 15MB)
    const MAX_SIZE = 15 * 1024 * 1024;
    if (audioFile.size > MAX_SIZE) {
      return NextResponse.json({ error: "Audio file exceeds maximum size limit (15MB)" }, { status: 413 });
    }

    const buffer = Buffer.from(await audioFile.arrayBuffer());
    const mimeType = audioFile.type || "audio/webm";

    const result = await transcribeAudio(buffer, mimeType);

    return NextResponse.json({
      transcript: result.transcript,
      isFallback: result.isFallback || false,
    });
  } catch (error) {
    console.error("[POST /api/messages/transcribe] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to transcribe audio" },
      { status: 500 }
    );
  }
}
