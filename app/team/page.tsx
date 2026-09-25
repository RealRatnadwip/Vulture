import Link from "next/link";
import { TEAM_MEMBERS } from "@/lib/team";
import { TeamScroller } from "@/components/team/TeamScroller";
import { Radio, ArrowLeft, ArrowRight, Sparkles, Terminal } from "lucide-react";

export const metadata = {
  title: "Team — VULTURE",
  description: "The crew building voice-first, time-aware squad broadcasting.",
};

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#f1f1ef] flex flex-col justify-between selection:bg-[#d7f24a] selection:text-[#0e0e0e]">
      {/* Top Header */}
      <header className="border-b border-[#1c1c1c] px-6 h-14 flex items-center justify-between max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 group text-xs font-mono text-[#888888] hover:text-[#f1f1ef] transition-colors"
          >
            <div className="w-6 h-6 rounded bg-[#181818] border border-[#2b2b2b] flex items-center justify-center group-hover:border-[#d7f24a] transition-colors">
              <Radio className="w-3.5 h-3.5 text-[#d7f24a]" />
            </div>
            <span className="font-mono text-xs font-bold tracking-widest uppercase text-[#f1f1ef]">
              VULTURE
            </span>
          </Link>

          <span className="text-[#333333]">/</span>
          <span className="text-xs font-mono text-[#d7f24a] bg-[#1a1a1a] px-2 py-0.5 rounded border border-[#282828]">
            team
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs font-mono text-[#888888] hover:text-[#f1f1ef] transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>OVERVIEW</span>
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

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 sm:py-16">
        {/* Hero Title */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#161616] border border-[#262626] text-[11px] font-mono text-[#999999] mb-4">
            <Terminal className="w-3 h-3 text-[#d7f24a]" />
            <span>crew & builders // team manifest</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-mono font-bold tracking-tight text-[#f1f1ef] uppercase">
            WHO BUILT VULTURE
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#888888] max-w-2xl font-light leading-relaxed">
            Engineers and designers building communication tools with zero respect for notification fatigue. 
            Small squad, fast iteration, high craft.
          </p>
        </div>

        {/* Side-Scrollable Team Cards */}
        <TeamScroller />

        {/* Culture / Philosophy Box */}
        <div className="mt-16 p-6 sm:p-8 rounded-xl bg-[#121212] border border-[#1f1f1f] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#d7f24a]" />
              <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-[#f1f1ef]">
                BUILD PHILOSOPHY
              </h2>
            </div>
            <p className="text-xs text-[#777777] max-w-xl leading-relaxed">
              We built Vulture because we were tired of losing critical incidents inside 50-message Slack threads. 
              Voice conveys tone and urgency 10x faster than typing. AI handles the sorting. The team stays in flow.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded font-mono text-xs font-semibold uppercase tracking-wider bg-[#d7f24a] text-[#0e0e0e] hover:bg-[#c6e33b] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(215,242,74,0.15)]"
            >
              <span>EXPERIENCE THE FEED</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] py-6 px-6 max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#555555]">
        <div>VULTURE · Voice-First, Time-Aware Broadcasting</div>
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:text-[#888888] transition-colors">concepts</Link>
          <span>·</span>
          <Link href="/team" className="text-[#d7f24a]">team</Link>
          <span>·</span>
          <Link href="/dashboard" className="hover:text-[#888888] transition-colors">feed demo</Link>
        </div>
      </footer>
    </div>
  );
}
