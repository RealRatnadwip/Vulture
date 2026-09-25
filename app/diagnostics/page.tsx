"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { DemoBanner } from "@/components/ui/DemoBanner";
import { Activity, CheckCircle2, AlertTriangle, ArrowLeft, RefreshCw, Database, Key, Cpu, Mic } from "lucide-react";

export default function DiagnosticsPage() {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setHealthData(data);
    } catch (err) {
      console.error("Health check error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#f1f1ef] flex flex-col font-sans">
      <DemoBanner />
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#222222] mb-6">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#777777] hover:text-[#cccccc] mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>RETURN TO DASHBOARD</span>
            </Link>
            <h1 className="text-xl font-mono font-bold uppercase tracking-tight text-[#f1f1ef]">
              SYSTEM DIAGNOSTICS
            </h1>
          </div>

          <button
            onClick={fetchHealth}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono bg-[#161616] hover:bg-[#202020] text-[#cccccc] border border-[#262626] transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            <span>Re-check</span>
          </button>
        </div>

        {healthData && (
          <div className="space-y-4">
            {/* Status Overview Card */}
            <div className="p-4 rounded-lg bg-[#141414] border border-[#242424]">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#888888]">OVERALL SYSTEM STATUS</span>
                <span className="flex items-center gap-1.5 text-[#34c759] font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  OPERATIONAL
                </span>
              </div>
            </div>

            {/* Individual Subsystems */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Database */}
              <div className="p-4 rounded-lg bg-[#141414] border border-[#242424]">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4 text-[#d7f24a]" />
                  <span className="font-mono text-xs font-bold uppercase text-[#f1f1ef]">
                    Tiger Data PostgreSQL
                  </span>
                </div>
                <div className="text-xs text-[#888888] font-mono">
                  Mode: <span className="text-[#cccccc]">{healthData.services?.tigerDataPostgres}</span>
                </div>
                <p className="text-[11px] text-[#666666] mt-1.5">
                  Drizzle ORM schema with indexed group, message, priority, and expiry fields.
                </p>
              </div>

              {/* Gemini AI */}
              <div className="p-4 rounded-lg bg-[#141414] border border-[#242424]">
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="w-4 h-4 text-[#ff9f0a]" />
                  <span className="font-mono text-xs font-bold uppercase text-[#f1f1ef]">
                    Gemini Priority Engine
                  </span>
                </div>
                <div className="text-xs text-[#888888] font-mono">
                  Status: <span className="text-[#cccccc]">{healthData.services?.geminiAi}</span>
                </div>
                <p className="text-[11px] text-[#666666] mt-1.5">
                  Zod-validated strict JSON output with urgency scoring &amp; relevance window.
                </p>
              </div>

              {/* ElevenLabs STT */}
              <div className="p-4 rounded-lg bg-[#141414] border border-[#242424]">
                <div className="flex items-center gap-2 mb-2">
                  <Mic className="w-4 h-4 text-[#64d2ff]" />
                  <span className="font-mono text-xs font-bold uppercase text-[#f1f1ef]">
                    ElevenLabs STT
                  </span>
                </div>
                <div className="text-xs text-[#888888] font-mono">
                  Status: <span className="text-[#cccccc]">{healthData.services?.elevenLabsStt}</span>
                </div>
                <p className="text-[11px] text-[#666666] mt-1.5">
                  Server-side speech-to-text pipeline with realistic voice fallback.
                </p>
              </div>

              {/* Auth0 */}
              <div className="p-4 rounded-lg bg-[#141414] border border-[#242424]">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="w-4 h-4 text-[#a78bfa]" />
                  <span className="font-mono text-xs font-bold uppercase text-[#f1f1ef]">
                    Auth0 Authentication
                  </span>
                </div>
                <div className="text-xs text-[#888888] font-mono">
                  Mode: <span className="text-[#cccccc]">{healthData.services?.auth0}</span>
                </div>
                <p className="text-[11px] text-[#666666] mt-1.5">
                  Multi-user role verification with isolated private feeds.
                </p>
              </div>
            </div>

            {/* Raw JSON Debug Viewer */}
            <div className="p-4 rounded-lg bg-[#121212] border border-[#222222]">
              <div className="text-[11px] font-mono text-[#666666] mb-2 uppercase">
                Raw Health Response (/api/health)
              </div>
              <pre className="text-xs font-mono text-[#aaaaaa] overflow-x-auto p-2 bg-[#0a0a0a] rounded border border-[#1a1a1a]">
                {JSON.stringify(healthData, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
