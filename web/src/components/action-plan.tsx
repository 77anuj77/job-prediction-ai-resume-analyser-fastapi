"use client";

import { Flame, Gauge, Timer } from "lucide-react";
import type { ActionItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const IMPACT: Record<ActionItem["impact"], { label: string; cls: string }> = {
  high: { label: "High impact", cls: "text-good" },
  medium: { label: "Medium impact", cls: "text-warn" },
  low: { label: "Low impact", cls: "text-ink-faint" },
};

const EFFORT: Record<ActionItem["effort"], { label: string }> = {
  low: { label: "Quick win" },
  medium: { label: "Moderate" },
  high: { label: "Deep work" },
};

export function ActionPlanCard({
  item,
  delay = 0,
}: {
  item: ActionItem;
  delay?: number;
}) {
  const impact = IMPACT[item.impact];
  return (
    <article
      style={{ transitionDelay: `${delay}ms` }}
      className="group relative overflow-hidden rounded-[1.75rem] bg-surface p-6 shadow-neo transition-all duration-500 ease-fluid hover:-translate-y-1 hover:shadow-neo-lg"
    >
      <span
        className="pointer-events-none absolute -right-3 -top-6 select-none font-display text-[92px] font-bold leading-none text-ink/[0.045] transition-colors duration-500 group-hover:text-accent/[0.07]"
        aria-hidden
      >
        {String(item.step).padStart(2, "0")}
      </span>
      <div className="relative">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink font-display text-[12px] font-bold text-raised shadow-neo-xs">
            {String(item.step).padStart(2, "0")}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
            Priority {item.step}
          </span>
        </div>
        <h3 className="mt-4 font-display text-[17px] font-semibold tracking-tight text-ink">
          {item.title}
        </h3>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{item.description}</p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full bg-inset/60 px-3 py-1 text-[11px] font-bold tracking-wide uppercase",
              impact.cls,
            )}
          >
            <Flame size={12} strokeWidth={2} />
            {impact.label}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-inset/60 px-3 py-1 text-[11px] font-bold tracking-wide uppercase text-ink-soft">
            {EFFORT[item.effort].label === "Quick win" ? (
              <Timer size={12} strokeWidth={2} />
            ) : (
              <Gauge size={12} strokeWidth={2} />
            )}
            {EFFORT[item.effort].label}
          </span>
        </div>
      </div>
    </article>
  );
}