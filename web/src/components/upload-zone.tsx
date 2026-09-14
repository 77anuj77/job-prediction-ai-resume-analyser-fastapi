"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  FileText,
  LoaderCircle,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/toast";
import { cn } from "@/lib/utils";
import { fallbackJd } from "@/lib/mock";

const ACCEPT =
  ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const EASE = [0.32, 0.72, 0, 1] as const;

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

function DropIcon({ active }: { active: boolean }) {
  return (
    <motion.span
      animate={{ scale: active ? [1, 1.06, 1] : 1, y: active ? [0, -3, 0] : 0 }}
      transition={{ duration: 1.4, repeat: active ? Infinity : 0, ease: "easeInOut" }}
      className={cn(
        "flex h-20 w-20 items-center justify-center rounded-[1.75rem] transition-colors duration-500",
        active ? "bg-accent-soft text-accent-strong" : "bg-surface text-accent-strong shadow-neo",
      )}
    >
      <UploadCloud size={34} strokeWidth={1.5} />
    </motion.span>
  );
}

export function UploadZone() {
  const router = useRouter();
  const { analyze, analyzing, analysisStatus } = useStore();
  const { push } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [jd, setJd] = useState("");
  const [showJd, setShowJd] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const accepted = useCallback((f: File) => {
    const okExt = /\.(pdf|docx?)$/i.test(f.name);
    const okType = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ].includes(f.type);
    return okExt || okType;
  }, []);

  const pickFile = (f: File) => {
    if (!f) return;
    if (f.size > 15 * 1024 * 1024) {
      push("error", "File exceeds the 15 MB limit.");
      return;
    }
    if (!accepted(f)) {
      push("error", "Please upload a PDF or DOCX file.");
      return;
    }
    setFile(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) pickFile(f);
  };

  const start = async () => {
    if (!file || analyzing) return;
    try {
      await analyze(file, jd);
      push("success", "Analysis complete. Your report is ready.");
      router.push("/dashboard");
    } catch {
      push("error", "Something went wrong while analyzing your resume.");
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-[2.5rem] bg-inset/50 p-1.5 transition-shadow duration-700 ease-fluid",
        "shadow-[0_1px_1px_rgba(255,255,255,0.8)_inset]",
      )}
    >
      <div className="rounded-[calc(2.5rem-12px)] bg-surface p-5 shadow-neo-lg sm:p-7">
        {/* Drop zone */}
        <motion.div
          animate={{ scale: dragging ? 1.012 : 1 }}
          transition={{ duration: 0.35, ease: EASE }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          aria-label="Choose or drop a resume file"
          className={cn(
            "relative flex cursor-pointer flex-col items-center justify-center rounded-[2rem] px-6 py-12 text-center transition-all duration-500 ease-fluid sm:py-16",
            dragging
              ? "bg-accent-soft shadow-inset"
              : "bg-inset/40 shadow-inset-sm hover:shadow-inset",
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) pickFile(f);
              e.target.value = "";
            }}
          />

          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="flex flex-col items-center"
              >
                <DropIcon active={dragging} />
                <p className="mt-7 font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                  Drop your resume here
                </p>
                <p className="mt-2 text-[13.5px] text-ink-soft">
                  or <span className="font-semibold text-accent-strong">click to browse</span> ·
                  PDF or DOCX up to 15 MB
                </p>
                <div className="mt-5 flex items-center gap-2">
                  <span className="rounded-full bg-good-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-good">
                    PDF
                  </span>
                  <span className="rounded-full bg-accent-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent-strong">
                    DOCX
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="file"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="flex w-full max-w-md flex-col items-center"
              >
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 320, damping: 20 }}
                  className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-good-soft text-good shadow-inset-sm"
                >
                  <Check size={28} strokeWidth={2} />
                </motion.span>
                <p className="mt-5 font-display text-lg font-semibold tracking-tight text-ink sm:text-xl">
                  {file.name}
                </p>
                <p className="mt-1 text-[13px] text-ink-soft">
                  {formatBytes(file.size)}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-inset/60 px-3.5 py-1.5 text-[12px] font-semibold text-ink-soft shadow-inset-sm transition-all duration-300 hover:text-ink"
                >
                  <X size={13} strokeWidth={2.25} /> Remove file
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Job description toggle */}
        <div className="mt-5 space-y-3">
          <button
            type="button"
            onClick={() => setShowJd((v) => !v)}
            aria-expanded={showJd}
            className="group flex w-full items-center justify-between rounded-[1.5rem] bg-surface px-5 py-4 shadow-neo-sm transition-all duration-500 ease-fluid hover:shadow-neo"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent-strong">
                <FileText size={16} strokeWidth={1.75} />
              </span>
              <span className="text-left">
                <span className="block text-[14px] font-semibold text-ink">
                  Target job description
                </span>
                <span className="block text-[12px] text-ink-faint">
                  Optional — scoring becomes sharply more accurate
                </span>
              </span>
            </span>
            <motion.span
              animate={{ rotate: showJd ? 45 : 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-inset/60 text-ink-soft shadow-inset-sm"
            >
              <Sparkles size={14} strokeWidth={2} />
            </motion.span>
          </button>

          <AnimatePresence>
            {showJd && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="overflow-hidden"
              >
                <div className="rounded-[1.75rem] bg-inset/40 p-1.5">
                  <div className="rounded-[calc(1.75rem-12px)] bg-surface p-4 shadow-inset-sm">
                    <textarea
                      value={jd}
                      onChange={(e) => setJd(e.target.value)}
                      placeholder="Paste the job description here..."
                      rows={5}
                      className="w-full resize-none rounded-2xl bg-transparent text-[13.5px] leading-relaxed text-ink outline-none placeholder:text-ink-faint"
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setJd(fallbackJd())}
                        className="rounded-full bg-accent-soft px-3 py-1.5 text-[11.5px] font-semibold text-accent-strong transition-transform duration-300 hover:scale-[1.03] active:scale-95"
                      >
                        Use sample JD
                      </button>
                      <span className="text-[11px] text-ink-faint">{jd.length} chars</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Analyze CTA */}
        <div className="mt-5 flex flex-col items-center gap-3">
          <motion.button
            type="button"
            onClick={start}
            disabled={!file || analyzing}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "group inline-flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-[15px] font-semibold tracking-tight transition-all duration-500 ease-fluid sm:w-auto",
              "shadow-neo hover:-translate-y-0.5 active:shadow-pressed disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0",
              file
                ? "bg-ink text-raised"
                : "bg-inset text-ink-faint",
            )}
          >
            {analyzing ? (
              <>
                <LoaderCircle size={17} strokeWidth={2} className="animate-spin" />
                {analysisStatus?.phase ?? "Analyzing resume..."}
              </>
            ) : (
              <>
                Analyze Resume
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-raised/15 text-raised transition-all duration-500 ease-snap group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-active:scale-95">
                  <ArrowUpRight size={15} strokeWidth={2.25} />
                </span>
              </>
            )}
          </motion.button>
          <p className="text-[12px] text-ink-faint">
            Your files never leave this device — nothing is stored on servers.
          </p>
        </div>
      </div>
    </div>
  );
}