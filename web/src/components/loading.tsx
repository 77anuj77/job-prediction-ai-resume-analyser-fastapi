"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";

const EASE = [0.32, 0.72, 0, 1] as const;

function SkeletonBlock({
  className,
  delay = 0,
}: {
  className: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0.4 }}
      animate={{ opacity: [0.4, 0.85, 0.4] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay }}
      className={`rounded-2xl bg-inset shadow-inset-sm ${className}`}
    />
  );
}

export function LoadingOverlay() {
  const { analyzing, analysisStatus } = useStore();

  return (
    <AnimatePresence>
      {analyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface/85 p-6 backdrop-blur-xl"
        >
          <div className="flex w-full max-w-md flex-col items-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-raised shadow-neo"
            >
              <Sparkles size={22} strokeWidth={1.75} className="animate-pulse" />
            </motion.div>

            <p className="mt-6 font-display text-lg font-semibold tracking-tight text-ink">
              {analysisStatus?.phase ?? "Analyzing resume"}
            </p>

            {/* progress track */}
            <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-inset shadow-inset-sm">
              <motion.div
                className="h-full origin-left rounded-full bg-gradient-to-r from-accent to-good"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: (analysisStatus?.progress ?? 20) / 100 }}
                transition={{ duration: 0.6, ease: EASE }}
              />
            </div>

            {/* skeleton dashboard preview */}
            <div className="mt-10 grid w-full grid-cols-2 gap-3">
              <SkeletonBlock className="col-span-2 h-24" delay={0} />
              <SkeletonBlock className="h-16" delay={0.1} />
              <SkeletonBlock className="h-16" delay={0.2} />
              <SkeletonBlock className="h-16" delay={0.05} />
              <SkeletonBlock className="h-16" delay={0.15} />
            </div>
            <div className="mt-3 grid w-full grid-cols-3 gap-3">
              <SkeletonBlock className="h-20" delay={0.08} />
              <SkeletonBlock className="h-20" delay={0.18} />
              <SkeletonBlock className="h-20" delay={0.28} />
            </div>
            <SkeletonBlock className="mt-3 h-24 w-full" delay={0.12} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <SkeletonBlock className="h-[26rem]" />
      </div>
      <div className="lg:col-span-7">
        <SkeletonBlock className="h-[12rem]" />
        <SkeletonBlock className="mt-4 h-[12rem]" />
      </div>
      <div className="lg:col-span-7">
        <SkeletonBlock className="h-[16rem]" />
      </div>
      <div className="lg:col-span-5">
        <SkeletonBlock className="h-[16rem]" />
      </div>
    </div>
  );
}