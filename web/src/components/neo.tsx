"use client";

import { motion } from "framer-motion";
import { ArrowRight, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────
   Reveal — scroll-triggered fade-up with blur for entrance
   ───────────────────────────────────────────────────────────── */

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-8% 0px" }}
      transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Neo — double-bezel neumorphic card (outer shell + inner core)
   ───────────────────────────────────────────────────────────── */

export function Neo({
  children,
  className,
  tone = "raised",
  radius = "2rem",
  padding = "p-6 sm:p-7",
  bezelPad = 6,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  tone?: "raised" | "inset";
  radius?: string;
  padding?: string;
  bezelPad?: number;
  as?: "div" | "li" | "section";
}) {
  return (
    <Tag
      className={cn(
        "bg-inset/50 shadow-[0_1px_1px_rgba(255,255,255,0.7)_inset]",
        className,
      )}
      style={{ borderRadius: `calc(${radius} + ${bezelPad}px)`, padding: bezelPad }}
    >
      <div
        className={cn(
          "h-full w-full bg-surface glow-ring",
          tone === "raised" ? "shadow-neo" : "shadow-inset",
          padding,
        )}
        style={{ borderRadius: radius }}
      >
        {children}
      </div>
    </Tag>
  );
}

/* ─────────────────────────────────────────────────────────────
   Eyebrow — microscopic pill preceding section headings
   ───────────────────────────────────────────────────────────── */

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-inset px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-soft shadow-inset-sm",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="font-display text-3xl font-semibold tracking-tight text-ink text-balance sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="max-w-xl text-[15px] leading-relaxed text-ink-soft text-pretty">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   NeoButton — magnetic pill with nested trailing icon
   ───────────────────────────────────────────────────────────── */

type ButtonVariant = "ink" | "soft" | "accent" | "inset";

const variantClass: Record<ButtonVariant, string> = {
  ink: "bg-ink text-raised shadow-neo",
  soft: "bg-surface text-ink shadow-neo",
  accent: "bg-accent text-white shadow-neo",
  inset: "bg-surface text-ink shadow-inset",
};

export function NeoButton({
  children,
  icon: Icon = ArrowRight,
  variant = "ink",
  className,
  disabled,
  onClick,
  type = "button",
  size = "md",
}: {
  children: ReactNode;
  icon?: LucideIcon;
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "px-5 py-2.5 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-7 py-3.5 text-[15px]",
  };
  const iconSizes = { sm: "h-6 w-6", md: "h-7 w-7", lg: "h-8 w-8" };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group inline-flex items-center gap-3 rounded-full font-semibold tracking-tight",
        "transition-all duration-500 ease-fluid",
        "hover:-translate-y-0.5 active:scale-[0.98] active:shadow-pressed",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0",
        sizes[size],
        variantClass[variant],
        className,
      )}
    >
      <span>{children}</span>
      <span
        className={cn(
          "flex items-center justify-center rounded-full transition-all duration-500 ease-snap",
          iconSizes[size],
          variant === "ink"
            ? "bg-raised/15 text-raised group-hover:scale-105 group-hover:bg-raised/25"
            : variant === "accent"
              ? "bg-white/20 text-white group-hover:scale-105 group-hover:bg-white/30"
              : "bg-ink/5 text-ink group-hover:scale-105 group-hover:translate-x-0.5 group-hover:bg-ink/10",
        )}
      >
        <Icon size={size === "lg" ? 16 : 15} strokeWidth={2} />
      </span>
    </button>
  );
}

export function IconButton({
  icon: Icon,
  onClick,
  label,
  className,
}: {
  icon: LucideIcon;
  onClick?: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface text-ink-soft shadow-neo-sm transition-all duration-500 ease-fluid",
        "hover:-translate-y-0.5 hover:text-ink active:scale-95 active:shadow-pressed",
        className,
      )}
    >
      <Icon size={16} strokeWidth={1.75} />
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   Progress — animated GPU-safe progress bar (scaleX)
   ───────────────────────────────────────────────────────────── */

export function Progress({
  value,
  tone = "accent",
  delay = 0,
  active,
  className,
  trackClass,
}: {
  value: number;
  tone?: "accent" | "good" | "warn" | "bad";
  delay?: number;
  active?: boolean;
  className?: string;
  trackClass?: string;
}) {
  const toneClass: Record<NonNullable<typeof tone>, string> = {
    accent: "bg-gradient-to-r from-accent to-accent-strong",
    good: "bg-gradient-to-r from-emerald-400 to-good",
    warn: "bg-gradient-to-r from-amber-400 to-warn",
    bad: "bg-gradient-to-r from-rose-400 to-bad",
  };
  const scaleX = Math.min(value, 100) / 100;
  const motionProps =
    active === undefined
      ? {
          initial: { scaleX: 0 },
          whileInView: { scaleX },
          viewport: { once: true },
        }
      : {
          initial: { scaleX: 0 },
          animate: { scaleX: active ? scaleX : 0 },
        };
  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-inset shadow-inset-sm",
        trackClass,
        className,
      )}
    >
      <motion.div
        className={cn("h-full w-full rounded-full origin-left", toneClass[tone])}
        {...motionProps}
        transition={{ duration: 1.1, ease: [0.32, 0.72, 0, 1], delay }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Pill — compact skill / tag chip
   ───────────────────────────────────────────────────────────── */

export function Pill({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: "default" | "good" | "warn" | "bad" | "accent";
  className?: string;
}) {
  const tones = {
    default: "bg-surface text-ink-soft shadow-neo-xs",
    good: "bg-good-soft text-emerald-800",
    warn: "bg-warn-soft text-amber-800",
    bad: "bg-bad-soft text-rose-800",
    accent: "bg-accent-soft text-accent-strong",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-semibold tracking-tight",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   IconChip — circular icon housing for insight cards
   ───────────────────────────────────────────────────────────── */

export function IconChip({
  icon: Icon,
  tone = "accent",
  size = "md",
  className,
}: {
  icon: LucideIcon;
  tone?: "accent" | "good" | "warn" | "bad" | "soft";
  size?: "sm" | "md";
  className?: string;
}) {
  const tones = {
    accent: "bg-accent-soft text-accent-strong",
    good: "bg-good-soft text-good",
    warn: "bg-warn-soft text-warn",
    bad: "bg-bad-soft text-bad",
    soft: "bg-ink/5 text-ink-soft",
  };
  const dims = { sm: "h-9 w-9", md: "h-11 w-11" };
  const icons = { sm: 16, md: 19 };
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-2xl",
        dims[size],
        tones[tone],
        className,
      )}
    >
      <Icon size={icons[size]} strokeWidth={1.75} />
    </span>
  );
}