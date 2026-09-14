"use client";

import { useRef } from "react";
import { BrainCircuit, CheckCircle2, FileSearch } from "lucide-react";
import { useInView } from "framer-motion";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";
import type { ResumeAnalysis } from "@/lib/types";
import { scoreLabel } from "@/lib/utils";
import { Eyebrow, IconChip, Neo, Progress, Reveal } from "@/components/neo";
import { ScoreRing } from "@/components/score-ring";
import { MetricCard } from "@/components/metric-card";

function toneFor(score: number): "accent" | "good" | "warn" | "bad" {
  if (score >= 78) return "good";
  if (score >= 60) return "warn";
  return "bad";
}

const SHORT: Record<string, string> = {
  ats: "ATS",
  skills: "Skills",
  exp: "Exp",
  edu: "Edu",
  fmt: "Format",
  kw: "Keywords",
};

function ScoreRadar({ analysis }: { analysis: ResumeAnalysis }) {
  const data = analysis.breakdown.map((item) => ({
    key: item.id,
    short: (SHORT[item.id] ?? item.category).toUpperCase(),
    score: item.score,
  }));
  return (
    <RadarChart width={220} height={220} data={data} cx="50%" cy="50%" outerRadius="72%">
      <PolarGrid stroke="rgba(139,146,173,0.22)" strokeDasharray="2 4" />
      <PolarAngleAxis
        dataKey="short"
        tick={{ fontSize: 10.5, fill: "rgba(16,17,23,0.48)", fontWeight: 600 }}
        axisLine={false}
      />
      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
      <Radar
        dataKey="score"
        stroke="#4f46e5"
        strokeOpacity={0.6}
        strokeWidth={2}
        fill="#4f46e5"
        fillOpacity={0.13}
        isAnimationActive
        animationDuration={1000}
      />
    </RadarChart>
  );
}

function BreakdownBars({ items }: { items: ResumeAnalysis["breakdown"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <div ref={ref} className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
      {items.map((item, i) => (
        <div key={item.id} className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between">
            <span className="text-[12.5px] font-semibold text-ink">{item.category}</span>
            <span className="font-display text-[13px] font-bold text-ink">{item.score}</span>
          </div>
          <Progress value={item.score} tone={toneFor(item.score)} delay={i * 0.06} active={inView} />
        </div>
      ))}
    </div>
  );
}

export function KpiHero({ analysis }: { analysis: ResumeAnalysis }) {
  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Score ring — the 3-second read */}
      <Reveal className="lg:col-span-5">
        <Neo className="h-full" padding="p-8">
          <div className="flex h-full flex-col items-center justify-center text-center">
            <Eyebrow>Overall ATS Score</Eyebrow>
            <div className="mt-8">
              <ScoreRing score={analysis.atsScore} />
            </div>
            <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight text-ink">
              {scoreLabel(analysis.atsScore)}
            </h2>
            <p className="mt-2 max-w-[240px] text-[13px] leading-relaxed text-ink-soft">
              {analysis.atsScore >= 78
                ? "Your resume clears most ATS filters and reads strongly against the target role."
                : analysis.atsScore >= 60
                  ? "A solid base — a few targeted edits will push you into strong-match territory."
                  : "Significant gaps remain. Follow the action plan to raise your odds."}
            </p>
            <div className="mt-7 flex items-center gap-4 text-[11.5px] font-semibold text-ink-faint">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} strokeWidth={2} className="text-good" />
                Parsed cleanly
              </span>
              <span className="flex items-center gap-1.5">
                <FileSearch size={13} strokeWidth={2} className="text-accent" />
                {analysis.jobMatch.matchedSkills.length} skills matched
              </span>
            </div>
          </div>
        </Neo>
      </Reveal>

      {/* Breakdown + metrics */}
      <div className="flex flex-col gap-6 lg:col-span-7">
        <Reveal delay={0.08}>
          <Neo className="h-full" padding="p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
                  Score breakdown
                </h2>
                <p className="text-[12.5px] text-ink-faint">How each dimension ranks</p>
              </div>
              <IconChip icon={FileSearch} tone="accent" size="sm" />
            </div>
            <div className="grid items-center gap-6 md:grid-cols-[1fr_220px]">
                <BreakdownBars items={analysis.breakdown} />
                <div className="hidden md:block" aria-hidden>
                  <ScoreRadar analysis={analysis} />
                </div>
              </div>
          </Neo>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-3">
          <Reveal delay={0.14}>
            <MetricCard
              icon={CheckCircle2}
              label="Skill Match"
              value={analysis.skillMatchScore}
              hint="vs. job requirements"
              tone={toneFor(analysis.skillMatchScore)}
            />
          </Reveal>
          <Reveal delay={0.2}>
            <MetricCard
              icon={FileSearch}
              label="Text Similarity"
              value={analysis.textSimilarityScore}
              hint="Resume vs. JD language"
              tone={toneFor(analysis.textSimilarityScore)}
            />
          </Reveal>
          <Reveal delay={0.26}>
            <MetricCard
              icon={BrainCircuit}
              label="ML Prediction"
              value={analysis.mlMatchScore}
              hint={analysis.mlPrediction}
              tone={toneFor(analysis.mlMatchScore)}
            />
          </Reveal>
        </div>
      </div>
    </div>
  );
}