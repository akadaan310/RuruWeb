"use client";

import { useEffect, useState } from "react";
import type { PollOption } from "@/lib/votes-store";

export default function PollSection() {
  const [options, setOptions] = useState<PollOption[] | null>(null);
  const [votedIds, setVotedIds] = useState<string[]>([]);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/votes")
      .then((res) => res.json())
      .then((data) => {
        setOptions(data.options);
        setVotedIds(data.votedIds ?? []);
      })
      .catch(() => setOptions([]));
  }, []);

  async function vote(id: string) {
    if (votedIds.includes(id) || pendingId) return;
    setPendingId(id);
    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.options) setOptions(data.options);
      if (data.votedIds) setVotedIds(data.votedIds);
    } finally {
      setPendingId(null);
    }
  }

  const sorted = options
    ? [...options].sort((a, b) => b.votes - a.votes)
    : null;
  const totalVotes = sorted?.reduce((sum, o) => sum + o.votes, 0) ?? 0;

  return (
    <section className="w-full max-w-2xl flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Vote on what&apos;s next
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          Pick your favorite upcoming idea. One vote per idea, per visitor.
        </p>
      </div>

      {!sorted && (
        <p className="text-zinc-500 dark:text-zinc-400">Loading poll…</p>
      )}

      {sorted && sorted.length === 0 && (
        <p className="text-zinc-500 dark:text-zinc-400">
          No poll options configured yet.
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {sorted?.map((option) => {
          const hasVoted = votedIds.includes(option.id);
          const share = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
          return (
            <li
              key={option.id}
              className="rounded-xl border border-black/10 dark:border-white/10 p-4 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium">{option.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {option.description}
                  </p>
                </div>
                <button
                  onClick={() => vote(option.id)}
                  disabled={hasVoted || pendingId !== null}
                  className="shrink-0 rounded-full px-4 py-2 text-sm font-medium bg-foreground text-background disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  {hasVoted ? "Voted" : pendingId === option.id ? "…" : "Vote"}
                </button>
              </div>
              <div className="h-2 w-full rounded-full bg-black/[.06] dark:bg-white/[.08] overflow-hidden">
                <div
                  className="h-full bg-foreground/70 transition-all"
                  style={{ width: `${share}%` }}
                />
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {option.votes} vote{option.votes === 1 ? "" : "s"} ({share}%)
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
