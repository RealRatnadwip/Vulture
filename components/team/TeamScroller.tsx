"use client";

import { useRef, useState, useEffect } from "react";
import { TEAM_MEMBERS } from "@/lib/team";
import { TeamCard } from "@/components/team/TeamCard";
import { ChevronLeft, ChevronRight, Terminal } from "lucide-react";

export function TeamScroller() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 340;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#d7f24a]" />
          <span className="text-[11px] font-mono text-[#888888] uppercase tracking-wider">
            {TEAM_MEMBERS.length} CREW MEMBERS · HORIZONTAL ROSTER
          </span>
        </div>

        {/* Scroll Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className="w-8 h-8 rounded-lg bg-[#161616] border border-[#262626] hover:border-[#d7f24a] text-[#888888] hover:text-[#d7f24a] disabled:opacity-30 disabled:hover:border-[#262626] disabled:hover:text-[#888888] transition-all flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className="w-8 h-8 rounded-lg bg-[#161616] border border-[#262626] hover:border-[#d7f24a] text-[#888888] hover:text-[#d7f24a] disabled:opacity-30 disabled:hover:border-[#262626] disabled:hover:text-[#888888] transition-all flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Side-Scrollable Track */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth focus:outline-none [-ms-overflow-style:none] [scrollbar-width:thin]"
      >
        {TEAM_MEMBERS.map((member) => (
          <TeamCard
            key={member.id}
            member={member}
            className="w-[280px] sm:w-[320px] flex-shrink-0 snap-start"
          />
        ))}
      </div>

      {/* Subtle indicator bar below cards */}
      <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-[#555555]">
        <span>← SCROLL OR DRAG TO VIEW ALL →</span>
        <span className="text-[#888888]">INDEX // 01 – {String(TEAM_MEMBERS.length).padStart(2, "0")}</span>
      </div>
    </div>
  );
}
