"use client";

import {
  Crosshair,
  Frame,
  Lightbulb,
  Route,
  Sparkles,
  TextSearch,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";
import type { Insight } from "@/lib/types";
import { cn } from "@/lib/utils";

const KIND_META: Record<
  Insight["kind"],
  { icon: LucideIcon; tone: "good" | "warn" | "bad" | "accent" }
> = {
  strength: { icon: Sparkles, tone: "good" },
  weakness: { icon: TrendingDown, tone: "warn" },
  "missing-skill": { icon: Crosshair, tone: "bad" },
  "missing-keyword": { icon: TextSearch, tone: "warn" },
  formatting: { icon: Frame, tone: "accent" },
  recommendation: { icon: Lightbulb, tone: "accent" },
};

const SEVERITY_DOT: Record<Insight["severity"], string> = {
  good: "bg-good",
  warn: "bg-warn",
  bad: "bg-bad",
  accent: "bg-accent",
};

export function InsightCard({
  insight,
  className,
}: {
  insight: Insight;
  className?: string;
}) {
  const meta = KIND_META[insight.kind];
  const Icon = meta.icon;
  return (
    <article
      className={cn(
        "group relative h-full rounded-[1.75rem] bg-surface p-6 shadow-neo transition-all duration-500 ease-fluid hover:-translate-y-1 hover:shadow-neo-lg",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[1.75rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100 glow-ring"
      />
      <div className="flex items-start gap-4">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
            meta.tone === "good" && "bg-good-soft text-good",
            meta.tone === "warn" && "bg-warn-soft text-warn",
            meta.tone === "bad" && "bg-bad-soft text-bad",
            meta.tone === "accent" && "bg-accent-soft text-accent-strong",
          )}
        >
          <Icon size={18} strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[15px] font-semibold tracking-tight text-ink">
            {insight.title}
          </h3>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
            {insight.description}
          </p>
          {insight.kind === "missing-skill" && (
            <a
              href="#roadmap"
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 text-[12px] font-semibold text-accent-strong transition-colors duration-300 hover:bg-accent hover:text-on-accent"
            >
              <Route size={13} strokeWidth={2} />
              View learning path
            </a>
          )}
        </div>
        <span
          className={cn(
            "mt-1 h-2 w-2 shrink-0 rounded-full",
            SEVERITY_DOT[insight.severity],
          )}
          aria-hidden
        />
      </div>
    </article>
  );
}