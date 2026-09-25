import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { verifyGroupMembership, getGroupById, getGroupMessages, createBroadcastMessage } from "@/lib/db";
import { transcribeAudio } from "@/lib/elevenlabs/stt";
import { classifyBroadcast } from "@/lib/ai/gemini";
import { createTextMessageSchema } from "@/lib/validation";

export const maxDuration = 45;

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    let groupId = "";
    let transcript = "";
    let durationMs: number | undefined;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      groupId = (formData.get("groupId") as string) || "";
      const durationStr = formData.get("durationMs") as string;
      if (durationStr) durationMs = parseInt(durationStr, 10);

      const rawTranscript = formData.get("transcript") as string;
      const audioFile = formData.get("audio") as Blob | File | null;

      if (rawTranscript && rawTranscript.trim()) {
        transcript = rawTranscript.trim();
      } else if (audioFile) {
        if (audioFile.size > 15 * 1024 * 1024) {
          return NextResponse.json({ error: "Audio exceeds 15MB limit" }, { status: 413 });
        }
        const buffer = Buffer.from(await audioFile.arrayBuffer());
        const mimeType = audioFile.type || "audio/webm";
        const sttResult = await transcribeAudio(buffer, mimeType);
        transcript = sttResult.transcript;
      } else {
        return NextResponse.json({ error: "Either audio file or transcript is required" }, { status: 400 });
      }
    } else {
      const body = await req.json();
      const parsed = createTextMessageSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: "Invalid request payload", details: parsed.error }, { status: 400 });
      }
      groupId = parsed.data.groupId;
      transcript = parsed.data.transcript;
      durationMs = parsed.data.durationMs;
    }

    if (!groupId) {
      return NextResponse.json({ error: "Missing groupId" }, { status: 400 });
    }

    if (!transcript || transcript.trim() === "") {
      return NextResponse.json({ error: "Transcript is empty or speech was not detected." }, { status: 400 });
    }

    // 2. Validate group membership (Do not trust client blindly)
    const isMember = await verifyGroupMembership(groupId, user.id);
    if (!isMember) {
      return NextResponse.json({ error: "Forbidden: You are not a member of this group." }, { status: 403 });
    }

    const group = await getGroupById(groupId);
    if (!group) {
      return NextResponse.json({ error: "Group not found." }, { status: 404 });
    }

    // 3. Fetch recent messages for Gemini temporal context
    const recentMessages = await getGroupMessages(groupId, { limit: 5 });
    const formattedContext = recentMessages.map((m) => ({
      sender: m.sender.name,
      transcript: m.transcript,
      priority: m.priority,
    }));

    // 4. Send transcript to Gemini / Classifier
    const classification = await classifyBroadcast(transcript, {
      groupName: group.name,
      recentMessages: formattedContext,
    });

    // 5. Calculate timestamps
    const now = new Date();
    const expiresAt = new Date(now.getTime() + classification.expiresInMinutes * 60 * 1000);
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    // 6. Persist message into PostgreSQL (or demo store)
    const newMessage = await createBroadcastMessage({
      id: messageId,
      groupId,
      senderId: user.id,
      transcript,
      summary: classification.summary,
      priority: classification.priority,
      category: classification.category,
      urgencyScore: classification.urgencyScore,
      durationMs: durationMs || null,
      processingStatus: "READY",
      createdAt: now,
      expiresAt,
    });

    // 7. Return complete message
    return NextResponse.json({
      id: newMessage.id,
      sender: newMessage.sender,
      transcript: newMessage.transcript,
      summary: newMessage.summary,
      priority: newMessage.priority,
      category: newMessage.category,
      urgencyScore: newMessage.urgencyScore,
      durationMs: newMessage.durationMs,
      createdAt: newMessage.createdAt,
      expiresAt: newMessage.expiresAt,
    });
  } catch (error) {
    console.error("[POST /api/messages/create] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create message" },
      { status: 500 }
    );
  }
}
