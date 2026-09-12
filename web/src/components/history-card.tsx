"use client";

import { ArrowUpRight, ArrowDownRight, Minus, Sparkles } from "lucide-react";
import Link from "next/link";
import type { HistoryEntry } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

export function HistoryCard({
  entry,
  onView,
  index = 0,
}: {
  entry: HistoryEntry;
  onView?: () => void;
  index?: number;
}) {
  const imp = entry.improvement;
  const trend =
    imp === null ? (
      <>
        <Minus size={12} strokeWidth={2.5} /> Baseline
      </>
    ) : imp >= 0 ? (
      <>
        <ArrowUpRight size={12} strokeWidth={2.5} /> +{imp} pts
      </>
    ) : (
      <>
        <ArrowDownRight size={12} strokeWidth={2.5} /> {imp} pts
      </>
    );

  return (
    <article
      style={{ transitionDelay: `${index * 40}ms` }}
      className="group relative rounded-[2rem] bg-inset/50 p-1.5 shadow-[0_1px_1px_rgba(255,255,255,0.8)_inset] transition-all duration-500 ease-fluid hover:-translate-y-1"
    >
      <div className="flex h-full flex-col rounded-[calc(2rem-12px)] bg-surface p-6 shadow-neo transition-shadow duration-500 ease-fluid group-hover:shadow-neo-lg">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate font-display text-[15.5px] font-semibold tracking-tight text-ink">
              {entry.filename}
            </h3>
            <p className="mt-0.5 text-[12px] text-ink-faint">{formatDate(entry.date)}</p>
          </div>
          <span
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-[15px] font-bold tracking-tight shadow-inset-sm",
              entry.atsScore >= 78
                ? "bg-good-soft text-good"
                : entry.atsScore >= 60
                  ? "bg-warn-soft text-warn"
                  : "bg-bad-soft text-bad",
            )}
          >
            {entry.atsScore}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-[11.5px] font-semibold text-accent-strong">
            <Sparkles size={12} strokeWidth={2} />
            {entry.targetTitle}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11.5px] font-bold tracking-wide",
              imp === null
                ? "bg-inset/60 text-ink-faint"
                : imp >= 0
                  ? "bg-good-soft text-good"
                  : "bg-bad-soft text-bad",
            )}
          >
            {trend}
          </span>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-ink/[0.06] pt-5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
            ATS Score
          </span>
          {onView ? (
            <button
              onClick={onView}
              className="group/view inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[12.5px] font-semibold text-raised shadow-neo-sm transition-all duration-500 ease-fluid hover:-translate-y-0.5 active:scale-95 active:shadow-pressed"
            >
              View Analysis
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-raised/15 transition-transform duration-500 ease-snap group-hover/view:translate-x-0.5">
                <ArrowUpRight size={12} strokeWidth={2.25} />
              </span>
            </button>
          ) : (
            <Link
              href="/history"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[12.5px] font-semibold text-raised shadow-neo-sm transition-all duration-500 ease-fluid hover:-translate-y-0.5 active:scale-95 active:shadow-pressed"
            >
              View in History
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-raised/15 transition-transform duration-500 ease-snap group-hover/view:translate-x-0.5">
                <ArrowUpRight size={12} strokeWidth={2.25} />
              </span>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}