import { NextResponse } from "next/server";
import { checkDatabaseHealth } from "@/lib/db";
import { isAuth0Configured, isDemoModeEnabled } from "@/lib/auth";

export async function GET() {
  const dbHealth = await checkDatabaseHealth();
  const demoActive = isDemoModeEnabled();
  const authConfigured = isAuth0Configured() || demoActive;
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here");
  const elevenLabsConfigured = Boolean(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_API_KEY !== "your_elevenlabs_api_key_here");

  return NextResponse.json({
    status: "ok",
    database: dbHealth.ok,
    databaseType: dbHealth.type,
    auth: authConfigured,
    ai: geminiConfigured || demoActive,
    speech: elevenLabsConfigured || demoActive,
    services: {
      tigerDataPostgres: dbHealth.type === "postgres" ? "connected" : "demo-store-fallback",
      databaseError: dbHealth.error || null,
      auth0: isAuth0Configured() ? "active" : (demoActive ? "demo-mode-active" : "unconfigured"),
      geminiAi: geminiConfigured ? "configured" : "deterministic-keyword-fallback",
      elevenLabsStt: elevenLabsConfigured ? "configured" : "demo-transcript-fallback",
    },
    demoMode: demoActive,
    timestamp: new Date().toISOString(),
  });
}
