"use client";

import { Check, ChevronRight, CircleX, Plus, Sparkles } from "lucide-react";
import type { JobMatch } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Neo, Pill, Progress, Reveal } from "@/components/neo";

const IMPORTANCE: Record<string, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export function JobMatchSection({ match }: { match: JobMatch }) {
  const pct = Math.min(match.matchPercent, 100);

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* JD match hero */}
      <Reveal className="lg:col-span-4">
        <Neo className="h-full" padding="p-7">
          <div className="flex h-full flex-col">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-faint">
              Job Description Match
            </p>
            <div className="mt-6 flex items-end gap-2">
              <span className="font-display text-6xl font-bold tracking-tight text-ink">
                {pct}
              </span>
              <span className="pb-2 text-lg font-semibold text-ink-faint">%</span>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
              {pct >= 78
                ? "Strong alignment with the requirements."
                : pct >= 55
                  ? "Relevant, but missing skills lower your odds."
                  : "Coverage is thin — prioritize the gaps below."}
            </p>
            <div className="mt-auto pt-6">
              <Progress
                value={pct}
                tone={pct >= 78 ? "good" : pct >= 55 ? "warn" : "bad"}
                className="h-3"
              />
            </div>
          </div>
        </Neo>
      </Reveal>

      {/* Matched / missing skills */}
      <div className="grid gap-6 sm:grid-cols-2 lg:col-span-8">
        <Reveal delay={0.06}>
          <Neo className="h-full" padding="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-[15px] font-semibold tracking-tight text-ink">
                Matched skills
              </h3>
              <Pill tone="good">{match.matchedSkills.length}</Pill>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {match.matchedSkills.slice(0, 18).map((s) => (
                <Pill key={s} tone="good">
                  <Check size={12} strokeWidth={2.5} />
                  {s}
                </Pill>
              ))}
              {match.matchedSkills.length === 0 && (
                <span className="text-[13px] text-ink-faint">No overlaps detected</span>
              )}
            </div>
          </Neo>
        </Reveal>

        <Reveal delay={0.12}>
          <Neo className="h-full" padding="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-[15px] font-semibold tracking-tight text-ink">
                Missing skills
              </h3>
              <Pill tone="bad">{match.missingSkills.length}</Pill>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {match.missingSkills.map((s) => (
                <Pill key={s} tone="bad">
                  <CircleX size={12} strokeWidth={2.5} />
                  {s}
                </Pill>
              ))}
              {match.missingSkills.length === 0 && (
                <span className="text-[13px] text-ink-faint">Complete coverage</span>
              )}
            </div>
          </Neo>
        </Reveal>
      </div>

      {/* Keyword comparison */}
      <Reveal className="lg:col-span-7">
        <Neo className="h-full" padding="p-6 sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-[15px] font-semibold tracking-tight text-ink">
                Keyword comparison
              </h3>
              <p className="text-[12.5px] text-ink-faint">
                Sub-skills the recruiter will screen for
              </p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent-strong">
              <Sparkles size={12} strokeWidth={2} />
              Recruiter radar
            </span>
          </div>
          <ul className="mt-5 space-y-1.5">
            {match.keywordComparison.map((k) => (
              <li
                key={k.keyword}
                className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors duration-300 hover:bg-inset/40"
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                    k.inResume
                      ? "bg-good-soft text-good"
                      : "bg-bad-soft text-bad",
                  )}
                >
                  {k.inResume ? (
                    <Check size={13} strokeWidth={2.5} />
                  ) : (
                    <CircleX size={13} strokeWidth={2.5} />
                  )}
                </span>
                <span className="flex-1 text-[13.5px] font-semibold capitalize text-ink">
                  {k.keyword}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider",
                    k.importance === "high"
                      ? "bg-inset/60 text-ink"
                      : "bg-inset/40 text-ink-faint",
                  )}
                >
                  {IMPORTANCE[k.importance]}
                </span>
              </li>
            ))}
          </ul>
        </Neo>
      </Reveal>

      {/* Recommended skills */}
      <Reveal delay={0.08} className="lg:col-span-5">
        <Neo className="h-full" padding="p-6 sm:p-7">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-[15px] font-semibold tracking-tight text-ink">
              Add to your resume
            </h3>
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-accent-soft text-accent-strong">
              <Plus size={16} strokeWidth={1.75} />
            </span>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">
            Fold these into existing bullet points with concrete context — never a bare list.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {match.recommendedSkills.map((s) => (
              <Pill key={s} tone="accent">
                {s}
              </Pill>
            ))}
            {match.recommendedSkills.length === 0 && (
              <span className="text-[13px] text-ink-faint">Nothing to add</span>
            )}
          </div>
          <a
            href="#action-plan"
            className="mt-7 inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent-strong transition-all duration-300 hover:gap-2.5"
          >
            Jump to action plan <ChevronRight size={14} strokeWidth={2} />
          </a>
        </Neo>
      </Reveal>
    </div>
  );
}