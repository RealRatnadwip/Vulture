import { NextResponse } from "next/server";
import { checkDatabaseHealth } from "@/lib/db";
import { isAuth0Configured } from "@/lib/auth";

export async function GET() {
  const dbHealth = await checkDatabaseHealth();
  const authConfigured = isAuth0Configured() || process.env.DEMO_MODE === "true";
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here");
  const elevenLabsConfigured = Boolean(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_API_KEY !== "your_elevenlabs_api_key_here");

  return NextResponse.json({
    status: "ok",
    database: dbHealth.ok,
    databaseType: dbHealth.type,
    auth: authConfigured,
    ai: geminiConfigured || process.env.DEMO_MODE === "true",
    speech: elevenLabsConfigured || process.env.DEMO_MODE === "true",
    services: {
      tigerDataPostgres: dbHealth.type === "postgres" ? "connected" : "demo-store-fallback",
      auth0: isAuth0Configured() ? "active" : "demo-mode-active",
      geminiAi: geminiConfigured ? "configured" : "deterministic-keyword-fallback",
      elevenLabsStt: elevenLabsConfigured ? "configured" : "demo-transcript-fallback",
    },
    demoMode: process.env.DEMO_MODE === "true",
    timestamp: new Date().toISOString(),
  });
}
