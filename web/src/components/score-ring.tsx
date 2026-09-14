"use client";

import { animate, motion } from "framer-motion";
import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";

export function AnimatedNumber({
  value,
  className,
  duration = 1.6,
}: {
  value: number;
  className?: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      ease: [0.32, 0.72, 0, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, duration]);

  return <span className={cn(className)}>{display}</span>;
}

function gradientFor(score: number): [string, string] {
  if (score >= 78) return ["#0E9F6E", "#4F46E5"];
  if (score >= 60) return ["#F59E0B", "#4F46E5"];
  return ["#E11D48", "#7C3AED"];
}

export function ScoreRing({
  score,
  size = 240,
  stroke = 13,
  delay = 0.25,
  label,
}: {
  score: number;
  size?: number;
  stroke?: number;
  delay?: number;
  label?: string;
}) {
  const gid = useId().replace(/:/g, "");
  const [from, to] = gradientFor(score);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const center = size / 2;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, score, {
      duration: 1.7,
      ease: [0.32, 0.72, 0, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [score]);

  return (
    <div className="relative select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="block">
        <defs>
          <linearGradient id={`ring-${gid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        {/* recessed track */}
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke="rgba(139,146,173,0.16)"
          strokeWidth={stroke}
        />
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth={2}
          opacity={0.6}
        />
        <g transform={`rotate(-90 ${center} ${center})`}>
          <motion.circle
            cx={center}
            cy={center}
            r={r}
            fill="none"
            stroke={`url(#ring-${gid})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            whileInView={{ strokeDashoffset: c * (1 - score / 100) }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: [0.32, 0.72, 0, 1], delay }}
          />
        </g>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <div className="flex items-baseline gap-1">
          <span className="font-display text-6xl font-bold tracking-tight text-ink">
            {display}
          </span>
          <span className="text-sm font-semibold text-ink-faint">/100</span>
        </div>
        {label ? (
          <span className="mt-1 text-center text-[13px] font-semibold text-ink-soft">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}