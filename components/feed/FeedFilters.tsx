"use client";

import React from "react";
import { Filter, Search } from "lucide-react";

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
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 py-2 border-b border-[#222222]">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-[#141414] p-0.5 rounded border border-[#242424]">
        <button
          type="button"
          onClick={() => onFilterChange("ALL")}
          className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
            currentFilter === "ALL"
              ? "bg-[#222222] text-[#f1f1ef] font-medium"
              : "text-[#777777] hover:text-[#cccccc]"
          }`}
        >
          ALL ({counts.all})
        </button>

        <button
          type="button"
          onClick={() => onFilterChange("IMPORTANT")}
          className={`px-3 py-1 text-xs font-mono rounded transition-colors flex items-center gap-1.5 ${
            currentFilter === "IMPORTANT"
              ? "bg-[#222222] text-[#ff9f0a] font-medium"
              : "text-[#777777] hover:text-[#cccccc]"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff9f0a]" />
          IMPORTANT ({counts.important})
        </button>

        <button
          type="button"
          onClick={() => onFilterChange("RECENT")}
          className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
            currentFilter === "RECENT"
              ? "bg-[#222222] text-[#f1f1ef] font-medium"
              : "text-[#777777] hover:text-[#cccccc]"
          }`}
        >
          RECENT
        </button>
      </div>

      {/* Lightweight Search */}
      <div className="relative flex-1 sm:max-w-xs">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#555555]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter messages..."
          className="w-full pl-8 pr-3 py-1 text-xs bg-[#141414] border border-[#242424] rounded text-[#e0e0e0] placeholder-[#555555] focus:outline-none focus:border-[#444444] transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[#666666] hover:text-[#999999]"
          >
            clear
          </button>
        )}
      </div>
    </div>
  );
}
