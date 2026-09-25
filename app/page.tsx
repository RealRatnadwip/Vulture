import React from "react";
import Link from "next/link";
import { Radio, ArrowRight, Mic, ShieldAlert, Clock, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#f1f1ef] flex flex-col justify-between selection:bg-[#d7f24a] selection:text-[#0e0e0e]">
      {/* Top Bar */}
      <header className="border-b border-[#1c1c1c] px-6 h-14 flex items-center justify-between max-w-5xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#181818] border border-[#2b2b2b] flex items-center justify-center">
            <Radio className="w-3.5 h-3.5 text-[#d7f24a]" />
          </div>
          <span className="font-mono text-xs font-bold tracking-widest uppercase text-[#f1f1ef]">
            VULTURE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-mono text-[#888888] hover:text-[#f1f1ef] transition-colors"
          >
            SIGN IN
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-mono font-medium px-3 py-1.5 rounded bg-[#f1f1ef] text-[#0e0e0e] hover:bg-[#ffffff] transition-all flex items-center gap-1.5"
          >
            <span>LIVE DEMO</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-16 sm:py-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#161616] border border-[#262626] text-[11px] font-mono text-[#999999] mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d7f24a]" />
          <span>voice-first · time-aware broadcasting</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-mono font-bold tracking-tight text-[#f1f1ef] uppercase">
          VULTURE
        </h1>

        <p className="mt-4 text-xl sm:text-2xl font-light text-[#a8a8a4] tracking-tight italic">
          &ldquo;information has a half-life.&rdquo;
        </p>

        <p className="mt-6 text-sm sm:text-base text-[#777777] max-w-xl mx-auto leading-relaxed">
          Voice-first broadcasts for small groups. Speak once. VULTURE decides what needs attention.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-3 rounded text-xs font-mono font-semibold tracking-wider uppercase bg-[#d7f24a] text-[#0e0e0e] hover:bg-[#c6e33b] transition-all shadow-[0_0_20px_rgba(215,242,74,0.15)] flex items-center justify-center gap-2"
          >
            <span>START A GROUP</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3 rounded text-xs font-mono font-medium tracking-wider uppercase bg-[#161616] text-[#cccccc] hover:text-[#f1f1ef] hover:bg-[#1d1d1d] border border-[#292929] transition-all"
          >
            SIGN IN
          </Link>
        </div>

        {/* Tri-Column Principles */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left w-full border-t border-[#1f1f1f] pt-12">
          <div className="p-4 rounded border border-[#1f1f1f] bg-[#121212]">
            <div className="flex items-center gap-2 mb-2">
              <Mic className="w-4 h-4 text-[#d7f24a]" />
              <h2 className="font-mono text-xs font-bold tracking-wider uppercase text-[#f1f1ef]">
                VOICE
              </h2>
            </div>
            <p className="text-xs text-[#888888] leading-relaxed">
              Speak instead of typing. ElevenLabs converts speech into clean, structured transcripts instantly.
            </p>
          </div>

          <div className="p-4 rounded border border-[#1f1f1f] bg-[#121212]">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-4 h-4 text-[#ff9f0a]" />
              <h2 className="font-mono text-xs font-bold tracking-wider uppercase text-[#f1f1ef]">
                PRIORITY
              </h2>
            </div>
            <p className="text-xs text-[#888888] leading-relaxed">
              Important things rise. Gemini analyzes urgency and context so outages never get lost in casual chatter.
            </p>
          </div>

          <div className="p-4 rounded border border-[#1f1f1f] bg-[#121212]">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-[#64d2ff]" />
              <h2 className="font-mono text-xs font-bold tracking-wider uppercase text-[#f1f1ef]">
                TIME
              </h2>
            </div>
            <p className="text-xs text-[#888888] leading-relaxed">
              Irrelevant things fade. When a meeting ends or a status passes, messages decay naturally in prominence.
            </p>
          </div>
        </div>

        {/* Realistic Miniature Feed Preview */}
        <div className="mt-14 w-full text-left">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#1f1f1f] text-xs font-mono text-[#666666]">
            <span>LIVE BROADCAST PREVIEW</span>
            <span className="flex items-center gap-1.5 text-[#34c759]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34c759] animate-pulse" />
              feed active
            </span>
          </div>

          <div className="space-y-3">
            {/* Critical Preview */}
            <div className="p-4 rounded-md bg-[#151515] border border-[#242424] border-l-2 border-l-[#ff453a]">
              <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                <span className="text-[#ff453a] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff453a] critical-indicator" />
                  CRITICAL PRIORITY
                </span>
                <span className="text-[#666666]">valid for 28m</span>
              </div>
              <div className="text-xs text-[#888888] mb-1">Ratnadwip · 12:41</div>
              <div className="text-sm text-[#f1f1ef]">
                Backend server is down. Don&apos;t deploy anything until it&apos;s back.
              </div>
              <div className="mt-2 text-[10px] font-mono text-[#666666]">INCIDENT · HIGH · URGENCY 98/100</div>
            </div>

            {/* Normal Preview */}
            <div className="p-4 rounded-md bg-[#151515] border border-[#242424] border-l-2 border-l-[#262626]">
              <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                <span className="text-[#666666] uppercase tracking-wider">NORMAL</span>
                <span className="text-[#666666]">valid for 2h</span>
              </div>
              <div className="text-xs text-[#888888] mb-1">Himanshu · 12:38</div>
              <div className="text-sm text-[#d8d8d6]">
                I&apos;ve pushed the latest frontend build.
              </div>
              <div className="mt-2 text-[10px] font-mono text-[#666666]">UPDATE · NORMAL</div>
            </div>

            {/* Expired Preview */}
            <div className="p-4 rounded-md bg-[#151515] border border-[#242424] border-l-2 border-l-[#3a3a3c] opacity-50">
              <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                <span className="text-[#555555] uppercase tracking-wider">LOW</span>
                <span className="text-[#555555]">expired 10m ago</span>
              </div>
              <div className="text-xs text-[#666666] mb-1">Koushik · 12:31</div>
              <div className="text-sm text-[#777777]">
                I&apos;ll join in about ten minutes.
              </div>
              <div className="mt-2 text-[10px] font-mono text-[#555555]">STATUS · LOW</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] py-6 px-6 max-w-5xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-[#555555]">
        <div>VULTURE · Tiger Data + ElevenLabs + Gemini + Auth0</div>
        <div>Speak once. The feed sorts itself.</div>
      </footer>
    </div>
  );
}
