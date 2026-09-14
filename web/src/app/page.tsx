"use client";

import { motion } from "framer-motion";
import { FileSearch, LineChart, Sparkles, Wand2 } from "lucide-react";
import { UploadZone } from "@/components/upload-zone";
import { Eyebrow, IconChip, Neo, Reveal } from "@/components/neo";

const EASE = [0.32, 0.72, 0, 1] as const;

const STEPS = [
  {
    icon: FileSearch,
    title: "Upload, and relax",
    body: "Drop your PDF or DOCX. Parsing is private and happens on your device.",
    tone: "accent" as const,
  },
  {
    icon: LineChart,
    title: "Get scored, instantly",
    body: "One glance at your ATS score reveals where you stand against the role.",
    tone: "good" as const,
  },
  {
    icon: Wand2,
    title: "Act on the plan",
    body: "Prioritized edits show exactly what to add, rewrite, and fix first.",
    tone: "warn" as const,
  },
];

export default function LandingPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-28 lg:pt-40">
      {/* Hero */}
      <div className="flex flex-col items-center text-center">
        <Reveal>
          <Eyebrow>
            <Sparkles size={12} strokeWidth={2} className="text-accent-strong" />
            ATS &amp; recruiter intelligence
          </Eyebrow>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="mx-auto mt-7 max-w-4xl font-display text-[44px] font-bold leading-[1.02] tracking-[-0.03em] text-ink text-balance sm:text-6xl lg:text-[76px]">
            Turn your resume into your{" "}
            <span className="relative inline-block">
              <span className="relative z-10">competitive</span>
              <motion.span
                aria-hidden
                className="absolute inset-x-0 bottom-1 z-0 h-3 rounded-full bg-gradient-to-r from-accent/25 via-accent/40 to-good/40"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.5 }}
              />
            </span>{" "}
            advantage.
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-ink-soft text-pretty sm:text-[17px]">
            ResumeAI reads your resume the way an ATS and a recruiter would — then tells you,
            in seconds, exactly how to beat the filter and land the role.
          </p>
        </Reveal>

        <Reveal delay={0.24} className="mt-12 w-full max-w-2xl">
          <UploadZone />
        </Reveal>
      </div>

      {/* How it works */}
      <section className="mt-24 lg:mt-32">
        <Reveal>
          <div className="flex flex-col items-center gap-4 text-center">
            <Eyebrow>Why ResumeAI</Eyebrow>
            <h2 className="max-w-xl font-display text-3xl font-semibold tracking-tight text-ink text-balance sm:text-4xl">
              Three steps from submitted to standout
            </h2>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.1}>
              <Neo className="h-full" padding="p-7">
                <IconChip icon={step.icon} tone={step.tone} />
                <h3 className="mt-6 font-display text-[17px] font-semibold tracking-tight text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{step.body}</p>
              </Neo>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section className="mt-24">
        <Reveal>
          <div className="flex flex-col items-center gap-5 rounded-[2rem] bg-ink px-8 py-10 text-center text-raised shadow-neo-lg">
            <p className="max-w-2xl font-display text-2xl font-semibold tracking-tight text-balance sm:text-[26px]">
              Private by design. Your resume never leaves your device.
            </p>
            <p className="max-w-xl text-[13.5px] leading-relaxed text-raised/65">
              No accounts, no data lakes, no training on your document. Analysis runs locally
              with an optional self-hosted model for deeper scoring.
            </p>
          </div>
        </Reveal>
      </section>
    </main>
  );
}