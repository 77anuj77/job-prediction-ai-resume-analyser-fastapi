"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  History,
  Settings2,
  Sparkles,
  ArrowUpRight,
  Star,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GithubIcon } from "@/components/github-icon";
import { cn, GITHUB_URL } from "@/lib/utils";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings2 },
];

const EASE = [0.32, 0.72, 0, 1] as const;

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname.startsWith("/dashboard") : pathname.startsWith(href);

  return (
    <>
      {/* Floating island nav (desktop) */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 hidden justify-center px-6 pt-5 lg:flex">
        <motion.nav
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="pointer-events-auto flex items-center gap-1 rounded-full bg-raised/80 p-1.5 shadow-neo-sm backdrop-blur-xl"
        >
          <Link
            href="/"
            className="mr-4 flex items-center gap-2 rounded-full px-3 py-2 font-display text-[15px] font-semibold tracking-tight text-ink transition-colors duration-300 hover:text-accent-strong"
            aria-label="ResumeAI home"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-raised shadow-neo-xs">
              <Sparkles size={15} strokeWidth={2} />
            </span>
            Resume<span className="text-accent-strong">AI</span>
          </Link>

          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                isActive(href)
                  ? "text-ink"
                  : "text-ink-faint hover:text-ink-soft",
              )}
            >
              {isActive(href) && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-inset shadow-inset-sm"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{label}</span>
            </Link>
          ))}

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Star ResumeAI on GitHub"
            title="Star on GitHub"
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-surface text-ink-soft shadow-neo-sm transition-all duration-500 ease-fluid hover:-translate-y-0.5 hover:rotate-12 hover:text-ink active:scale-90 active:shadow-pressed"
          >
            <Star size={15} strokeWidth={1.75} className="fill-current" />
          </a>

          <Link
            href="/"
            className="group ml-2 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-raised shadow-neo-sm transition-all duration-500 ease-fluid hover:-translate-y-0.5 active:scale-[0.98] active:shadow-pressed"
          >
            Analyze
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-raised/15 transition-transform duration-500 ease-snap group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight size={13} strokeWidth={2.25} />
            </span>
          </Link>
        </motion.nav>
      </header>

      {/* Mobile island bar */}
      <header className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4 lg:hidden">
        <div className="flex w-full max-w-md items-center justify-between rounded-full bg-raised/85 p-2 pl-3 shadow-neo-sm backdrop-blur-xl">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-full py-1.5 font-display text-[15px] font-semibold tracking-tight text-ink"
            aria-label="ResumeAI home"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-raised shadow-neo-xs">
              <Sparkles size={15} strokeWidth={2} />
            </span>
            Resume<span className="text-accent-strong">AI</span>
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className={cn(
              "relative flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-full shadow-inset-sm transition-shadow duration-500",
              open ? "shadow-pressed" : "",
            )}
          >
            <motion.span
              className="h-[2px] w-5 rounded-full bg-ink"
              animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            />
            <motion.span
              className="h-[2px] w-5 rounded-full bg-ink"
              animate={open ? { opacity: 0, x: -12 } : { opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
            />
            <motion.span
              className="h-[2px] w-5 rounded-full bg-ink"
              animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            />
          </button>
        </div>
      </header>

      {/* Full-screen overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 z-30 flex flex-col justify-end bg-surface/90 px-6 pb-16 pt-28 backdrop-blur-2xl lg:hidden"
          >
            <nav className="flex flex-col gap-2">
              {LINKS.map(({ href, label, icon: Icon }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, y: 40, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.05 + i * 0.07 }}
                >
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-4 rounded-3xl p-5 font-display text-2xl font-semibold tracking-tight transition-colors duration-300",
                      isActive(href)
                        ? "bg-ink text-raised shadow-neo"
                        : "bg-surface text-ink shadow-neo-sm",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-2xl",
                        isActive(href)
                          ? "bg-raised/15 text-raised"
                          : "bg-inset text-ink-soft shadow-inset-sm",
                      )}
                    >
                      <Icon size={18} strokeWidth={1.75} />
                    </span>
                    {label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 40, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.24 }}
              >
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-4 rounded-3xl bg-accent p-5 font-display text-2xl font-semibold tracking-tight text-white shadow-neo"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
                    <ArrowUpRight size={18} strokeWidth={2} />
                  </span>
                  Analyze Resume
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 40, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.32 }}
              >
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-4 rounded-3xl bg-inset p-5 shadow-inset-sm transition-colors duration-300"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface text-ink shadow-neo-xs">
                    <GithubIcon size={17} className="text-ink" />
                  </span>
                  <span className="text-[15px] font-semibold text-ink-soft">Star on GitHub</span>
                  <span className="ml-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-ink text-amber-300 shadow-neo-xs">
                    <Star size={16} strokeWidth={1.75} className="fill-current" />
                  </span>
                </a>
              </motion.div>
            </nav>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 text-center text-xs text-ink-faint"
            >
              Files are processed locally. Nothing is stored.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}