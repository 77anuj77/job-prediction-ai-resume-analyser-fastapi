"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, CircleCheck, CircleX, TriangleAlert, Sparkle } from "lucide-react";
import { useState } from "react";
import type { SectionScore } from "@/lib/types";
import { cn } from "@/lib/utils";

const EASE = [0.32, 0.72, 0, 1] as const;

function scoreTone(score: number): string {
  if (score >= 78) return "text-good";
  if (score >= 60) return "text-warn";
  return "text-bad";
}

function feedbackIcon(severity: SectionScore["feedback"][number]["severity"]) {
  switch (severity) {
    case "good":
      return <CircleCheck size={14} strokeWidth={2} className="mt-0.5 shrink-0 text-good" />;
    case "bad":
      return <CircleX size={14} strokeWidth={2} className="mt-0.5 shrink-0 text-bad" />;
    case "warn":
      return <TriangleAlert size={14} strokeWidth={2} className="mt-0.5 shrink-0 text-warn" />;
    default:
      return <Sparkle size={14} strokeWidth={2} className="mt-0.5 shrink-0 text-accent" />;
  }
}

export function AnalysisAccordion({ sections }: { sections: SectionScore[] }) {
  const [open, setOpen] = useState<Set<string>>(new Set([sections[0]?.id ?? ""]));

  const toggle = (id: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {sections.map((section) => {
        const isOpen = open.has(section.id);
        return (
          <div
            key={section.id}
            className={cn(
              "overflow-hidden rounded-[1.5rem] bg-surface transition-all duration-500 ease-fluid",
              isOpen ? "shadow-neo" : "shadow-neo-sm hover:shadow-neo",
            )}
          >
            <button
              onClick={() => toggle(section.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-4 px-5 py-4 text-left"
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[13px] font-bold tracking-tight shadow-inset-sm",
                  scoreTone(section.score),
                )}
              >
                {section.score}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-[14.5px] font-semibold tracking-tight text-ink">
                  {section.label}
                </span>
                <span className="block text-[11.5px] text-ink-faint">
                  {section.present ? "Section detected" : "Section missing"}
                </span>
              </span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                  section.present ? "bg-good-soft text-good" : "bg-bad-soft text-bad",
                )}
              >
                {section.present ? "OK" : "Gap"}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-ink-soft shadow-neo-xs"
              >
                <ChevronDown size={15} strokeWidth={1.75} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <div className="space-y-2.5 px-5 pb-5 pt-1">
                    {section.feedback.map((f, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, ease: EASE, delay: i * 0.06 }}
                        className="flex items-start gap-2.5 rounded-2xl bg-inset/50 px-4 py-3"
                      >
                        {feedbackIcon(f.severity)}
                        <div>
                          <p className="text-[13px] font-semibold text-ink">{f.note}</p>
                          <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-soft">
                            {f.detail}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}