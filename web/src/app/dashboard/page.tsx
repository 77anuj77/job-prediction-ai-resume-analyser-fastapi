"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Briefcase,
  Building2,
  Clock3,
  Download,
  MapPin,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ActionPlanCard } from "@/components/action-plan";
import { AnalysisAccordion } from "@/components/accordion";
import { KpiHero } from "@/components/dashboard/kpi-hero";
import { JobMatchSection } from "@/components/dashboard/job-match";
import { OptimizeModal } from "@/components/dashboard/optimize-modal";
import { InsightCard } from "@/components/insight-card";
import { DashboardSkeleton } from "@/components/loading";
import { NeoButton, Pill, Reveal, SectionHeading } from "@/components/neo";
import { useToast } from "@/components/toast";
import { useStore } from "@/lib/store";
import { downloadReport } from "@/lib/report";
import { cn, formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const { analysis, apiAvailable } = useStore();
  const { push } = useToast();
  const router = useRouter();
  const [optimizeOpen, setOptimizeOpen] = useState(false);

  useEffect(() => {
    if (!analysis) {
      const timer = setTimeout(() => router.replace("/"), 50);
      return () => clearTimeout(timer);
    }
  }, [analysis, router]);

  if (!analysis) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-28 lg:pt-36">
        <DashboardSkeleton />
      </main>
    );
  }

  const handleDownload = () => {
    downloadReport(analysis);
    push("success", "Report generated and downloaded.");
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-28 lg:pt-36">
      {/* Header — file meta + download */}
      <Reveal>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
              {apiAvailable ? (
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-good" />
                  Live model
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-warn" />
                  Local preview engine
                </span>
              )}
              <span className="text-ink/20">/</span>
              <span>Analysis report</span>
            </div>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {analysis.filename}
            </h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13.5px] text-ink-soft">
              <span className="font-semibold text-ink">{analysis.candidateName}</span>
              <span className="flex items-center gap-1">
                <Briefcase size={13} strokeWidth={1.75} />
                {analysis.targetTitle}
              </span>
              <span className="flex items-center gap-1">
                <Clock3 size={13} strokeWidth={1.75} />
                {formatDate(analysis.date)}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <NeoButton variant="soft" icon={Download} onClick={handleDownload}>
              Download Report
            </NeoButton>
            <NeoButton
              variant="inset"
              icon={RefreshCw}
              onClick={() => {
                router.push("/");
              }}
            >
              New Analysis
            </NeoButton>
          </div>
        </div>
      </Reveal>

      {/* Score hero */}
      <div className="mt-10">
        <KpiHero analysis={analysis} />
      </div>

      {/* Insights */}
      <section className="mt-24">
        <SectionHeading
          eyebrow="Resume insights"
          title="Where it reads strong — and where it leaks"
          subtitle="The model scanned structure, keywords, and language density across every section of your resume."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {analysis.insights.map((insight, i) => (
            <Reveal
              key={insight.id}
              delay={i * 0.04}
              className={cn(insight.kind === "strength" && "md:col-span-2 lg:col-span-2")}
            >
              <InsightCard insight={insight} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Job match */}
      <section id="job-match" className="mt-24">
        <SectionHeading
          eyebrow="Job match"
          title="Alignment with the target role"
          subtitle="Skills, keyword radar, and the exact gaps between your resume and the job description."
        />
        <div className="mt-10">
          <JobMatchSection match={analysis.jobMatch} />
        </div>
      </section>

      {/* Resume section analysis */}
      <section id="sections" className="mt-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Section analysis"
              title="Piece-by-piece breakdown"
              subtitle="Click any section to expand the model's specific feedback and scoring rationale."
            />
            <div className="mt-6 hidden gap-2 lg:flex">
              <Pill tone="good">Parsed sections</Pill>
              <Pill tone="warn">Improve</Pill>
              <Pill tone="bad">Gaps</Pill>
            </div>
          </div>
          <div className="lg:col-span-7">
            <Reveal>
              <AnalysisAccordion sections={analysis.sections} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Action plan */}
      <section id="action-plan" className="mt-24">
        <SectionHeading
          eyebrow="Action plan"
          title="Improve your resume"
          subtitle="Prioritized edits ordered by their impact on your score — not our opinion of your merit."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {analysis.actionPlan.map((item, i) => (
            <Reveal key={item.step} delay={i * 0.06}>
              <ActionPlanCard item={item} />
            </Reveal>
          ))}

          {/* Optimize CTA card */}
          <Reveal delay={0.3}>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-ink p-7 text-raised shadow-neo-lg">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.5),transparent_65%)]"
              />
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-raised/15 text-raised">
                <TrendingUp size={18} strokeWidth={1.75} />
              </span>
              <h3 className="relative mt-5 font-display text-xl font-semibold tracking-tight">
                +8–14 pts achievable
              </h3>
              <p className="relative mt-2 text-[13.5px] leading-relaxed text-raised/70">
                Applying the five steps above typically lifts a resume into the next scoring
                band. Start with the highest-impact edit.
              </p>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setOptimizeOpen(true)}
                className="group relative mt-6 inline-flex items-center gap-2.5 rounded-full bg-raised px-5 py-3 text-sm font-semibold text-ink shadow-neo-sm transition-all duration-500 ease-fluid hover:-translate-y-0.5 active:scale-95"
              >
                <Sparkles size={15} strokeWidth={2} />
                Optimize My Resume
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-raised transition-transform duration-500 ease-snap group-hover:translate-x-0.5">
                  <ArrowUpRight size={13} strokeWidth={2.25} />
                </span>
              </motion.button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Skill roadmap + job recommendations */}
      <section id="roadmap" className="mt-24 grid gap-6 lg:grid-cols-12 scroll-mt-24">
        <Reveal className="lg:col-span-7">
          <div className="h-full rounded-[2rem] bg-inset/50 p-1.5">
            <div className="h-full rounded-[calc(2rem-12px)] bg-surface p-6 shadow-neo sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                    Closing the gaps
                  </h3>
                  <p className="text-[12.5px] text-ink-faint">
                    A short learning path for your top missing skills
                  </p>
                </div>
                <Pill tone="accent">Roadmap</Pill>
              </div>
              <div className="mt-6 space-y-4">
                {analysis.skillRoadmap.map((r) => (
                  <div
                    key={r.skill}
                    className="rounded-2xl bg-inset/40 p-4 transition-colors duration-300 hover:bg-inset/60"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-display text-[14.5px] font-semibold text-ink">
                        {r.skill}
                      </span>
                      <span className="text-[11px] font-semibold text-accent-strong">
                        Why: {r.why}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {r.learn.map((l) => (
                        <Pill key={l} tone="default">
                          {l}
                        </Pill>
                      ))}
                      <Pill tone="accent">{r.project}</Pill>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-5">
          <div className="h-full rounded-[2rem] bg-inset/50 p-1.5">
            <div className="flex h-full flex-col rounded-[calc(2rem-12px)] bg-surface p-6 shadow-neo sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                    Similar openings
                  </h3>
                  <p className="text-[12.5px] text-ink-faint">Ranked by fit, India market</p>
                </div>
                <Pill tone="good">Matched</Pill>
              </div>
              <div className="mt-5 flex flex-1 flex-col gap-3">
                {analysis.jobRecommendations.slice(0, 3).map((job) => (
                  <div
                    key={job.job_title + job.company}
                    className="group rounded-2xl bg-inset/40 p-4 transition-all duration-300 hover:bg-inset/60"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-display text-[14px] font-semibold text-ink">
                          {job.job_title}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-ink-soft">
                          <Building2 size={12} strokeWidth={1.75} />
                          {job.company}
                        </p>
                      </div>
                      <span className="font-display text-[14px] font-bold text-accent-strong">
                        {Math.round(job.recommendation_score)}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-ink-faint">
                      <span className="flex items-center gap-1">
                        <MapPin size={11} strokeWidth={1.75} />
                        {job.location}
                      </span>
                      <span>{job.experience}</span>
                      <span className="font-semibold text-ink-soft">{job.salary}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <OptimizeModal
        analysis={analysis}
        open={optimizeOpen}
        onClose={() => setOptimizeOpen(false)}
      />
    </main>
  );
}