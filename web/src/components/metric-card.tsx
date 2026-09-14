"use client";

import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  hint,
  tone = "accent",
  className,
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  unit?: string;
  hint?: string;
  tone?: "accent" | "good" | "warn" | "bad";
  className?: string;
}) {
  const icons = {
    accent: "bg-accent-soft text-accent-strong",
    good: "bg-good-soft text-good",
    warn: "bg-warn-soft text-warn",
    bad: "bg-bad-soft text-bad",
  };
  return (
    <div
      className={cn(
        "group relative rounded-[1.5rem] bg-surface p-5 shadow-neo transition-all duration-500 ease-fluid hover:-translate-y-0.5 hover:shadow-neo-lg",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform duration-500 ease-snap group-hover:scale-110",
            icons[tone],
          )}
        >
          <Icon size={16} strokeWidth={1.75} />
        </span>
        <span className="text-[16px] font-semibold text-ink-faint">%</span>
      </div>
      <p className="mt-4 font-display text-[26px] font-bold leading-none tracking-tight text-ink">
        {value}
        {unit ? <span className="text-base font-semibold text-ink-faint">{unit}</span> : null}
      </p>
      <p className="mt-1 text-[12.5px] font-semibold tracking-wide text-ink-soft">{label}</p>
      {hint ? <p className="mt-1 text-[11.5px] text-ink-faint">{hint}</p> : null}
    </div>
  );
}