import Link from "next/link";
import { TEAM_MEMBERS } from "@/lib/team";
import { TeamScroller } from "@/components/team/TeamScroller";
import { Radio, ArrowLeft, ArrowRight, Sparkles, Terminal, Users } from "lucide-react";

export const metadata = {
  title: "Crew — VULTURE",
  description: "The crew building voice-first, time-aware squad broadcasting.",
};

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-[#08090b] text-[#f8f8f6] flex flex-col justify-between selection:bg-[#d4f65b] selection:text-[#08090b]">
      {/* Top Header */}
      <header className="border-b border-[#212431]/80 px-4 sm:px-6 h-15 flex items-center justify-between max-w-6xl w-full mx-auto backdrop-blur-xl bg-[#08090b]/80 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 group text-xs font-mono text-[#94a3b8] hover:text-[#f8f8f6] transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-[#12131b] border border-[#272b3c] flex items-center justify-center group-hover:border-[#d4f65b]/70 transition-all shadow-sm">
              <Radio className="w-4 h-4 text-[#d4f65b]" />
            </div>
            <span className="font-mono text-xs font-extrabold tracking-widest uppercase text-[#f8f8f6]">
              VULTURE
            </span>
          </Link>

          <span className="text-[#3b4054]">/</span>
          <span className="text-xs font-mono text-[#ddd6fe] bg-[#141624] px-2.5 py-0.5 rounded-full border border-[#2b3046]">
            CREW MANIFEST
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="text-xs font-mono text-[#94a3b8] hover:text-[#f8f8f6] transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>OVERVIEW</span>
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-mono font-bold px-3.5 py-1.5 rounded-lg bg-[#d4f65b] text-[#08090b] hover:bg-[#c3e848] transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(212,246,91,0.2)]"
          >
            <span>LAUNCH SQUAD</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Hero Title */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12141e] border border-[#25293d] text-xs font-mono text-[#94a3b8] mb-4">
            <Terminal className="w-3.5 h-3.5 text-[#d4f65b]" />
            <span>CREATIVE COLLECTIVE // CORE BUILDERS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-mono font-black text-[#f8f8f6] tracking-tight uppercase">
            MEET THE CREW
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#94a3b8] max-w-xl font-sans leading-relaxed">
            The cross-functional engineers, designers, and systems architects pioneering voice-first emergency broadcasting.
          </p>
        </div>

        {/* Carousel & Grid */}
        <TeamScroller members={TEAM_MEMBERS} />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1d202d] py-8 px-6 max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#64748b]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#d4f65b]" />
          <span>VULTURE // CREW ROSTER</span>
        </div>
        <p>Built with Tiger Data PostgreSQL · Next.js · ElevenLabs · Google Gemini</p>
        <Link href="/" className="hover:text-[#f8f8f6] transition-colors">
          RETURN TO HOME
        </Link>
      </footer>
    </div>
  );
}
