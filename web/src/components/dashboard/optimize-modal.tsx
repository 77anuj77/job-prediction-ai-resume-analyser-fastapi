"use client";

import { Check, ChevronRight, FileText, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ResumeAnalysis } from "@/lib/types";
import { Modal } from "@/components/modal";
import { Pill } from "@/components/neo";

export function OptimizeModal({
  analysis,
  open,
  onClose,
}: {
  analysis: ResumeAnalysis;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const primary = analysis.actionPlan[0];

  return (
    <Modal open={open} onClose={onClose} label="Optimize my resume">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-raised shadow-neo-sm">
          <Sparkles size={18} strokeWidth={1.75} />
        </span>
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
            Optimize My Resume
          </h2>
          <p className="text-[12.5px] text-ink-faint">6 edits · estimated +8–14 pts</p>
        </div>
      </div>

      <div className="mt-6 space-y-2.5">
        {analysis.actionPlan.map((item, i) => (
          <div
            key={item.step}
            className="flex items-center gap-3 rounded-2xl bg-inset/40 px-4 py-3"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[11px] font-bold text-accent-strong">
              {String(item.step).padStart(2, "0")}
            </span>
            <span className="flex-1 text-[13.5px] font-semibold text-ink">{item.title}</span>
            {i === 0 && (
              <Pill tone="accent">
                <Check size={11} strokeWidth={2.5} /> Start here
              </Pill>
            )}
          </div>
        ))}
      </div>

      <p className="mt-5 rounded-2xl bg-accent-soft px-4 py-3 text-[12.5px] leading-relaxed text-accent-strong">
        <strong>Why this matters:</strong>{" "}
        {primary
          ? primary.title
          : "The prioritized edits below directly target your biggest scoring gaps."}{" "}
        — addressing the top item alone typically lifts your score into the next band.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={onClose}
          className="rounded-full bg-surface px-5 py-3 text-sm font-semibold text-ink-soft shadow-neo-sm transition-all duration-500 ease-fluid hover:text-ink active:scale-95 active:shadow-pressed"
        >
          Not now
        </button>
        <button
          onClick={() => {
            onClose();
            router.push("/");
          }}
          className="group flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-raised shadow-neo transition-all duration-500 ease-fluid hover:-translate-y-0.5 active:scale-[0.98] active:shadow-pressed"
        >
          <FileText size={15} strokeWidth={2} />
          Re-upload a revised resume
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-raised/15 transition-transform duration-500 ease-snap group-hover:translate-x-0.5">
            <ChevronRight size={13} strokeWidth={2.25} />
          </span>
        </button>
      </div>
    </Modal>
  );
}