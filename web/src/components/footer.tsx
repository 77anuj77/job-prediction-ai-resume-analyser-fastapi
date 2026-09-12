"use client";

import { History, LayoutDashboard, Settings2, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useToast } from "@/components/toast";
import { GithubIcon } from "@/components/github-icon";
import { GITHUB_URL } from "@/lib/utils";

export function Footer() {
  const { push } = useToast();
  const items = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/history", label: "History", icon: History },
    { href: "/settings", label: "Settings", icon: Settings2 },
  ];
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-24 pt-20">
      <div className="rounded-[2rem] bg-inset/50 p-[1px]">
        <div className="rounded-[2rem] bg-surface shadow-neo glow-ring">
          <div className="flex flex-col gap-8 px-6 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
              className="flex flex-col gap-2"
            >
              <Link href="/" className="flex w-fit items-center gap-2 font-display text-lg font-semibold tracking-tight text-ink">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-raised shadow-neo-xs">
                  <Sparkles size={15} strokeWidth={2} />
                </span>
                Resume<span className="text-accent-strong">AI</span>
              </Link>
              <p className="max-w-xs text-[12.5px] leading-relaxed text-ink-faint">
                Private-first ATS analysis. Upload a resume, paste a job, and see exactly how you
                stack up.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1], delay: 0.08 }}
              className="hidden items-center gap-2 lg:flex"
            >
              {items.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2 rounded-full bg-surface px-4 py-2.5 text-[13px] font-semibold text-ink-soft shadow-neo-sm transition-all duration-500 ease-fluid hover:-translate-y-0.5 hover:text-ink active:scale-95 active:shadow-pressed"
                >
                  <Icon size={14} strokeWidth={1.75} />
                  {label}
                </Link>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1], delay: 0.16 }}
            >
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-raised shadow-neo transition-all duration-500 ease-fluid hover:-translate-y-0.5 active:scale-[0.98] active:shadow-pressed"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-raised/15">
                  <GithubIcon size={15} className="text-raised" />
                </span>
                Star on GitHub
                <Star
                  size={15}
                  strokeWidth={1.75}
                  className="fill-current text-amber-300 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
                />
              </a>
            </motion.div>
          </div>

          <div className="flex flex-col items-center gap-5 border-t border-ink/5 px-6 py-6 sm:px-8 lg:flex-row lg:justify-between">
            <div className="flex items-center gap-2 lg:hidden">
              {items.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2 rounded-full bg-surface px-4 py-2.5 text-[13px] font-semibold text-ink-soft shadow-neo-sm transition-all duration-500 ease-fluid hover:-translate-y-0.5 hover:text-ink active:scale-95 active:shadow-pressed"
                >
                  <Icon size={14} strokeWidth={1.75} />
                  {label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-6 text-[12px] text-ink-faint">
              <span>ResumeAI · Private-first resume analysis</span>
              <button
                onClick={() => push("info", "ResumeAI 1.0 — running locally on device.")}
                className="transition-colors duration-300 hover:text-ink"
              >
                v1.0.0
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}