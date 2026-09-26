"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { MessageWithSender } from "@/lib/db";
import { MessageCard } from "./MessageCard";
import { FeedFilters, FilterType } from "./FeedFilters";
import { FullScreenAlert } from "@/components/mobile/FullScreenAlert";
import { PriorityLevel } from "@/lib/validation";
import { Radio, Zap } from "lucide-react";

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
  const [fullScreenAlert, setFullScreenAlert] = useState<MessageWithSender | null>(null);
  const [showTestControls, setShowTestControls] = useState(false);

  const hasLoadedInitialRef = useRef(initialMessages.length > 0);
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

            // FLASH SCREEN & VIBRATE PHONE based on message priority (when page is opened)
            if (hasLoadedInitialRef.current) {
              const priorityWeights: Record<string, number> = {
                CRITICAL: 4,
                HIGH: 3,
                NORMAL: 2,
                LOW: 1,
              };

              const topMsg = [...fresh].sort(
                (a, b) => (priorityWeights[b.priority] || 1) - (priorityWeights[a.priority] || 1)
              )[0];

              if (typeof window !== "undefined") {
                window.dispatchEvent(
                  new CustomEvent("vulture:flash", {
                    detail: {
                      id: topMsg.id,
                      priority: topMsg.priority as PriorityLevel,
                      senderName: topMsg.sender?.name,
                      transcript: topMsg.transcript,
                      summary: topMsg.summary || undefined,
                      urgencyScore: topMsg.urgencyScore || undefined,
                      category: topMsg.category || undefined,
                    },
                  })
                );
              }
            }

            // Trigger full-screen mobile takeover alert for CRITICAL / high-urgency broadcasts
            const critical = fresh.find(
              (m) => m.priority === "CRITICAL" || (m.urgencyScore && m.urgencyScore >= 80)
            );
            if (critical && hasLoadedInitialRef.current) {
              setFullScreenAlert(critical);
            }

            const merged = [...fresh, ...prev];
            merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            return merged;
          });

          // Mark initial history as loaded
          hasLoadedInitialRef.current = true;

          // Update latest timestamp pointer
          const newest = incoming[0];
          latestTimestampRef.current = new Date(newest.createdAt).toISOString();
        } else if (isMounted) {
          hasLoadedInitialRef.current = true;
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

    // Trigger screen flash & vibration feedback for local broadcast
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("vulture:flash", {
          detail: {
            id: newMsg.id,
            priority: (newMsg.priority as PriorityLevel) || "NORMAL",
            senderName: newMsg.sender?.name || "YOU",
            transcript: newMsg.transcript,
            summary: newMsg.summary || undefined,
            urgencyScore: newMsg.urgencyScore || undefined,
            category: newMsg.category || undefined,
          },
        })
      );
    }
  };

  // Diagnostic / Preview trigger to test screen flash and vibration
  const triggerTestAlert = (p: PriorityLevel) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("vulture:flash", {
          detail: {
            id: "test-" + Date.now(),
            priority: p,
            senderName: "TACTICAL SIMULATOR",
            transcript: `Simulated ${p} priority broadcast transmission received.`,
            summary: `Testing ${p} visual screen flash and mobile haptic response.`,
            urgencyScore: p === "CRITICAL" ? 95 : p === "HIGH" ? 75 : p === "NORMAL" ? 45 : 15,
            category: p === "CRITICAL" ? "SECURITY" : p === "HIGH" ? "OPS" : "ROUTINE",
          },
        })
      );
    }
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

      {/* Tactical Alert & Haptics Simulator Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#121212] border border-[#202020] rounded-lg">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-[#d7f24a]" />
          <span className="font-mono text-[11px] text-[#888888]">
            HAPTIC & SCREEN FLASH ALERTS:
          </span>
          <span className="font-mono text-[10px] text-[#34c759] bg-[#1a2d1f] px-1.5 py-0.5 rounded border border-[#2b4c34]">
            ACTIVE
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowTestControls(!showTestControls)}
          className="font-mono text-[11px] text-[#777777] hover:text-[#d7f24a] transition-colors flex items-center gap-1"
        >
          <span>{showTestControls ? "[ HIDE SIMULATOR ]" : "[ TEST HAPTICS ]"}</span>
        </button>
      </div>

      {/* Expanded Simulator Controls */}
      {showTestControls && (
        <div className="p-3 bg-[#151515] border border-[#262626] rounded-lg flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="font-mono text-[10px] text-[#777777] uppercase w-full sm:w-auto">
            Test Vibration & Flash:
          </span>
          <button
            type="button"
            onClick={() => triggerTestAlert("CRITICAL")}
            className="px-2.5 py-1 rounded bg-[#ff453a]/20 hover:bg-[#ff453a]/30 border border-[#ff453a]/50 text-[#ff453a] font-mono text-[11px] font-bold transition-colors flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff453a] animate-ping" />
            CRITICAL (RED STROBE)
          </button>
          <button
            type="button"
            onClick={() => triggerTestAlert("HIGH")}
            className="px-2.5 py-1 rounded bg-[#ff9f0a]/20 hover:bg-[#ff9f0a]/30 border border-[#ff9f0a]/50 text-[#ff9f0a] font-mono text-[11px] font-bold transition-colors"
          >
            HIGH (AMBER PULSE)
          </button>
          <button
            type="button"
            onClick={() => triggerTestAlert("NORMAL")}
            className="px-2.5 py-1 rounded bg-[#d7f24a]/20 hover:bg-[#d7f24a]/30 border border-[#d7f24a]/50 text-[#d7f24a] font-mono text-[11px] font-bold transition-colors"
          >
            NORMAL (LIME FLASH)
          </button>
          <button
            type="button"
            onClick={() => triggerTestAlert("LOW")}
            className="px-2.5 py-1 rounded bg-[#64d2ff]/20 hover:bg-[#64d2ff]/30 border border-[#64d2ff]/50 text-[#64d2ff] font-mono text-[11px] transition-colors"
          >
            LOW (SOFT WASH)
          </button>
        </div>
      )}

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
            <MessageCard
              key={msg.id}
              message={msg}
              isNew={msg.id === newestId}
              onTriggerAlert={setFullScreenAlert}
            />
          ))
        )}
      </div>

      {/* Full-Screen Mobile Takeover Alert for Critical Incidents */}
      {fullScreenAlert && (
        <FullScreenAlert
          message={fullScreenAlert}
          onDismiss={() => setFullScreenAlert(null)}
        />
      )}
    </div>
  );
}
