"use client";

import React, { useState } from "react";
import { X, Plus, Loader2 } from "lucide-react";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupCreated: (group: any) => void;
}

export function CreateGroupModal({ isOpen, onClose, onGroupCreated }: CreateGroupModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create group");
      }

      onGroupCreated(data.group);
      setName("");
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm rounded-lg bg-[#141414] border border-[#292929] p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
          <h3 className="font-mono text-sm font-semibold tracking-wide text-[#f1f1ef] uppercase">
            Start a Group
          </h3>
          <button
            onClick={onClose}
            className="text-[#666666] hover:text-[#e0e0e0] p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#888888] mb-1.5 uppercase">
              Group Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. INCIDENT RESPONSE, SPRINT 4"
              className="w-full px-3 py-2 text-sm bg-[#1a1a1a] border border-[#2b2b2b] rounded text-[#f1f1ef] placeholder-[#555555] focus:outline-none focus:border-[#d7f24a]"
              autoFocus
            />
          </div>

          {error && <p className="text-xs text-[#ff5252]">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-[#888888] hover:text-[#cccccc]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded bg-[#f1f1ef] text-[#0e0e0e] hover:bg-[#ffffff] disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
