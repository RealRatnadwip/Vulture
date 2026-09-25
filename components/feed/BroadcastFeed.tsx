"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { MessageWithSender } from "@/lib/db";
import { MessageCard } from "./MessageCard";
import { FeedFilters, FilterType } from "./FeedFilters";
import { Radio } from "lucide-react";

interface BroadcastFeedProps {
  groupId: string;
  initialMessages?: MessageWithSender[];
}

export function BroadcastFeed({ groupId, initialMessages = [] }: BroadcastFeedProps) {
  const [messages, setMessages] = useState<MessageWithSender[]>(initialMessages);
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [newestId, setNewestId] = useState<string | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(initialMessages.length === 0);

  const latestTimestampRef = useRef<string | null>(
    initialMessages.length > 0 ? new Date(initialMessages[0].createdAt).toISOString() : null
  );

  // Poll for new messages every 2 seconds while group page is active
  useEffect(() => {
    let isMounted = true;

    async function pollNewMessages() {
      try {
        const url = latestTimestampRef.current
          ? `/api/messages?groupId=${groupId}&since=${encodeURIComponent(latestTimestampRef.current)}`
          : `/api/messages?groupId=${groupId}`;

        const res = await fetch(url);
        if (!res.ok) return;

        const data = await res.json();
        const incoming: MessageWithSender[] = data.messages || [];

        if (incoming.length > 0 && isMounted) {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const fresh = incoming.filter((m) => !existingIds.has(m.id));
            if (fresh.length === 0) return prev;

            // Highlight the newest message
            setNewestId(fresh[0].id);

            const merged = [...fresh, ...prev];
            merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            return merged;
          });

          // Update latest timestamp pointer
          const newest = incoming[0];
          latestTimestampRef.current = new Date(newest.createdAt).toISOString();
        }
      } catch (err) {
        console.warn("[BroadcastFeed] Poll error:", err);
      } finally {
        if (isMounted) setLoadingInitial(false);
      }
    }

    // Initial fetch if needed
    if (initialMessages.length === 0) {
      pollNewMessages();
    }

    const interval = setInterval(pollNewMessages, 2000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [groupId, initialMessages.length]);

  // Method to insert a message broadcasted locally by this user immediately
  const handleLocalBroadcast = (newMsg: MessageWithSender) => {
    setMessages((prev) => {
      const existing = prev.find((m) => m.id === newMsg.id);
      if (existing) return prev;
      setNewestId(newMsg.id);
      return [newMsg, ...prev];
    });
    latestTimestampRef.current = new Date(newMsg.createdAt).toISOString();
  };

  // Expose local broadcast handler via window event or ref if needed
  useEffect(() => {
    const handleBroadcastEvent = (e: CustomEvent) => {
      if (e.detail) handleLocalBroadcast(e.detail);
    };
    window.addEventListener("vulture:new-broadcast" as any, handleBroadcastEvent as any);
    return () => {
      window.removeEventListener("vulture:new-broadcast" as any, handleBroadcastEvent as any);
    };
  }, []);

  // Filter & Search Logic
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      // 1. Tab Filter
      if (filter === "IMPORTANT") {
        if (m.priority !== "CRITICAL" && m.priority !== "HIGH") return false;
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inTranscript = m.transcript.toLowerCase().includes(query);
        const inSummary = m.summary?.toLowerCase().includes(query);
        const inSender = m.sender.name.toLowerCase().includes(query);
        const inCategory = m.category.toLowerCase().includes(query);
        if (!inTranscript && !inSummary && !inSender && !inCategory) return false;
      }

      return true;
    });
  }, [messages, filter, searchQuery]);

  const counts = useMemo(() => {
    const all = messages.length;
    const important = messages.filter((m) => m.priority === "CRITICAL" || m.priority === "HIGH").length;
    return { all, important };
  }, [messages]);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Feed Filters */}
      <FeedFilters
        currentFilter={filter}
        onFilterChange={setFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        counts={counts}
      />

      {/* Feed List */}
      <div className="flex flex-col gap-3 min-h-[300px]">
        {loadingInitial ? (
          // Skeleton loading
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="p-4 rounded-md bg-[#151515] border border-[#222222] animate-pulse space-y-2.5"
              >
                <div className="h-3 bg-[#242424] rounded w-24" />
                <div className="h-3 bg-[#1e1e1e] rounded w-40" />
                <div className="h-4 bg-[#262626] rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-[#222222] rounded-lg">
            <Radio className="w-8 h-8 text-[#444444] mx-auto mb-2" />
            <p className="text-sm text-[#888888] font-mono">No broadcasts in this feed yet.</p>
            <p className="text-xs text-[#555555] mt-1">
              Hold the microphone button below to broadcast to this group.
            </p>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <MessageCard key={msg.id} message={msg} isNew={msg.id === newestId} />
          ))
        )}
      </div>
    </div>
  );
}
