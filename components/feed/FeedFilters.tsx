"use client";

import React from "react";
import { Filter, Search, X } from "lucide-react";

export type FilterType = "ALL" | "IMPORTANT" | "RECENT";

interface FeedFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  counts: { all: number; important: number };
}

export function FeedFilters({
  currentFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  counts,
}: FeedFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 py-3 border-b border-[#181a24]">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-[#090a0f] p-1 rounded-xl border border-[#1e2230]">
        <button
          type="button"
          onClick={() => onFilterChange("ALL")}
          className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
            currentFilter === "ALL"
              ? "bg-[#11131b] text-[#d4f65b] font-bold border border-[#1e2230] shadow-sm"
              : "text-[#94a3b8] hover:text-[#f8f8f6] hover:bg-[#10121a]"
          }`}
        >
          ALL ({counts.all})
        </button>

        <button
          type="button"
          onClick={() => onFilterChange("IMPORTANT")}
          className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 ${
            currentFilter === "IMPORTANT"
              ? "bg-[#11131b] text-[#fda4af] font-bold border border-[#1e2230] shadow-sm"
              : "text-[#94a3b8] hover:text-[#f8f8f6] hover:bg-[#10121a]"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#fda4af]" />
          CRITICAL & HIGH ({counts.important})
        </button>

        <button
          type="button"
          onClick={() => onFilterChange("RECENT")}
          className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
            currentFilter === "RECENT"
              ? "bg-[#11131b] text-[#7dd3fc] font-bold border border-[#1e2230] shadow-sm"
              : "text-[#94a3b8] hover:text-[#f8f8f6] hover:bg-[#10121a]"
          }`}
        >
          RECENT
        </button>
      </div>

      {/* Modern Search */}
      <div className="relative flex-1 sm:max-w-xs">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search transcripts or tags..."
          className="w-full pl-9 pr-8 py-1.5 text-xs font-mono bg-[#090a0f] border border-[#1e2230] rounded-xl text-[#f8f8f6] placeholder-[#64748b] focus:outline-none focus:border-[#d4f65b]/50 focus:ring-1 focus:ring-[#d4f65b]/30 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#f8f8f6] p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
