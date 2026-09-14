"use client";

import { ArrowRight, History as HistoryIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { HistoryCard } from "@/components/history-card";
import { NeoButton, Reveal } from "@/components/neo";
import { useToast } from "@/components/toast";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export default function HistoryPage() {
  const { history, loadById, clearHistory } = useStore();
  const { push } = useToast();
  const router = useRouter();

  const view = (id: string) => {
    const loaded = loadById(id);
    if (loaded) {
      push("info", `Loaded analysis from ${formatDate(loaded.date)}`);
      router.push("/dashboard");
    } else {
      push("error", "That analysis is no longer available.");
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-28 lg:pt-36">
      <Reveal>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
              <HistoryIcon size={13} strokeWidth={2} />
              Archive
            </div>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Analysis history
            </h1>
            <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-ink-soft">
              Every resume you&apos;ve analyzed, stored locally on this device. Tap a card to
              reopen the full report.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-surface px-4 py-2 text-[13px] font-semibold text-ink-soft shadow-neo-sm">
              {history.length} {history.length === 1 ? "report" : "reports"}
            </span>
            {history.length > 0 && (
              <NeoButton
                variant="soft"
                icon={Trash2}
                onClick={() => {
                  clearHistory();
                  push("info", "History cleared.");
                }}
              >
                Clear all
              </NeoButton>
            )}
          </div>
        </div>
      </Reveal>

      {history.length === 0 ? (
        <Reveal delay={0.1} className="mt-14">
          <div className="flex flex-col items-center rounded-[2rem] bg-surface px-6 py-20 text-center shadow-neo">
            <span className="flex h-16 w-16 items-center justify-center rounded-[1.75rem] bg-inset text-ink-faint shadow-inset-sm">
              <HistoryIcon size={26} strokeWidth={1.5} />
            </span>
            <h2 className="mt-6 font-display text-xl font-semibold tracking-tight text-ink">
              No analyses yet
            </h2>
            <p className="mt-2 max-w-sm text-[13.5px] leading-relaxed text-ink-soft">
              Upload your first resume to see its ATS score and a tailored improvement plan.
            </p>
            <button
              onClick={() => router.push("/")}
              className="group mt-7 inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-raised shadow-neo transition-all duration-500 ease-fluid hover:-translate-y-0.5 active:scale-[0.98] active:shadow-pressed"
            >
              Analyze your first resume
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-raised/15 transition-transform duration-500 ease-snap group-hover:translate-x-0.5">
                <ArrowRight size={14} strokeWidth={2.25} />
              </span>
            </button>
          </div>
        </Reveal>
      ) : (
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...history].reverse().map((entry, i) => (
            <Reveal key={entry.id} delay={i * 0.05}>
              <HistoryCard entry={entry} onView={() => view(entry.id)} index={i} />
            </Reveal>
          ))}
        </div>
      )}
    </main>
  );
}