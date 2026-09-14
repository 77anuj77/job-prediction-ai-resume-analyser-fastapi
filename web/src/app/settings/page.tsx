"use client";

import { Cpu, Database, Globe2, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/modal";
import { Eyebrow, IconChip, NeoButton, Pill, Reveal, SectionHeading } from "@/components/neo";
import { useToast } from "@/components/toast";
import { useStore } from "@/lib/store";

export default function SettingsPage() {
  const { apiAvailable, history, clearHistory, analysis } = useStore();
  const { push } = useToast();
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-24 pt-28 lg:pt-36">
      <Reveal>
        <SectionHeading
          eyebrow="Settings"
          title="Engine, data & privacy"
          subtitle="ResumeAI runs entirely in your browser. Nothing below touches a server unless you choose the live model."
        />
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {/* Engine status */}
        <Reveal>
          <div className="h-full rounded-[2rem] bg-inset/50 p-1.5">
            <div className="flex h-full flex-col rounded-[calc(2rem-12px)] bg-surface p-6 shadow-neo sm:p-7">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IconChip icon={Cpu} tone={apiAvailable ? "good" : "accent"} />
                  <h2 className="font-display text-[16px] font-semibold tracking-tight text-ink">
                    Analysis engine
                  </h2>
                </div>
                <Pill tone={apiAvailable ? "good" : "warn"}>
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${apiAvailable ? "bg-good" : "bg-warn"}`}
                  />
                  {apiAvailable ? "Live model" : "Local preview"}
                </Pill>
              </div>
              <p className="mt-4 text-[13.5px] leading-relaxed text-ink-soft">
                {apiAvailable
                  ? "Connected to the self-hosted scoring backend. Resume text is sent to your own server only."
                  : "No backend detected — running the built-in preview engine. Start the FastAPI service to enable full ML scoring."}
              </p>
              <div className="mt-5 flex items-center gap-2 rounded-2xl bg-inset/40 px-4 py-3 text-[12px]">
                <Globe2 size={14} strokeWidth={1.75} className="shrink-0 text-ink-faint" />
                <code className="truncate font-mono text-ink-soft">
                  {process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}
                </code>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Privacy */}
        <Reveal delay={0.08}>
          <div className="h-full rounded-[2rem] bg-inset/50 p-1.5">
            <div className="flex h-full flex-col rounded-[calc(2rem-12px)] bg-surface p-6 shadow-neo sm:p-7">
              <div className="flex items-center gap-3">
                <IconChip icon={LockKeyhole} tone="warn" />
                <h2 className="font-display text-[16px] font-semibold tracking-tight text-ink">
                  Privacy by default
                </h2>
              </div>
              <ul className="mt-4 space-y-2.5">
                {[
                  "Documents are parsed on-device, never uploaded.",
                  "History and reports live in your browser's local storage.",
                  "No accounts, cookies, or tracking pixels, period.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13.5px] text-ink-soft">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-good" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        {/* Data */}
        <Reveal className="lg:col-span-2">
          <div className="rounded-[2rem] bg-inset/50 p-1.5">
            <div className="rounded-[calc(2rem-12px)] bg-surface p-6 shadow-neo sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <IconChip icon={Database} tone="accent" />
                  <div>
                    <h2 className="font-display text-[16px] font-semibold tracking-tight text-ink">
                      Local data
                    </h2>
                    <p className="text-[12.5px] text-ink-faint">
                      {history.length} stored {history.length === 1 ? "report" : "reports"} ·
                      {analysis ? " 1 active" : " no active report"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <NeoButton
                    variant="soft"
                    icon={Database}
                    onClick={() => push("info", "Local data is already on this device only.")}
                  >
                    Export data
                  </NeoButton>
                  <NeoButton
                    variant="inset"
                    className="text-bad"
                    icon={Database}
                    disabled={history.length === 0}
                    onClick={() => setConfirmClear(true)}
                  >
                    Clear history
                  </NeoButton>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <Modal open={confirmClear} onClose={() => setConfirmClear(false)} label="Clear all data">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-bad-soft text-bad">
            <Database size={18} strokeWidth={1.75} />
          </span>
          <div>
            <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
              Clear all local data?
            </h2>
            <p className="text-[12.5px] text-ink-faint">
              This removes {history.length} reports and cannot be undone.
            </p>
          </div>
        </div>
        <div className="mt-7 flex items-center gap-3">
          <button
            onClick={() => setConfirmClear(false)}
            className="flex-1 rounded-full bg-surface px-5 py-3 text-sm font-semibold text-ink-soft shadow-neo-sm transition-all duration-500 hover:text-ink active:scale-95 active:shadow-pressed"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              clearHistory();
              setConfirmClear(false);
              push("success", "All local data cleared.");
            }}
            className="flex-1 rounded-full bg-bad px-5 py-3 text-sm font-semibold text-white shadow-neo transition-all duration-500 hover:-translate-y-0.5 active:scale-[0.98] active:shadow-pressed"
          >
            Clear everything
          </button>
        </div>
      </Modal>

      <Reveal className="mt-10">
        <Eyebrow>
          <LockKeyhole size={12} strokeWidth={2} />
          Local-first
        </Eyebrow>
      </Reveal>
    </main>
  );
}