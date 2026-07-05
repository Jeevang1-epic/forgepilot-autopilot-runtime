"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export const navigationItems = [
  {
    href: "/",
    label: "Command Center",
    description: "Launch and monitor local autopilot runs",
  },
  {
    href: "/run/demo",
    label: "Flight Recorder",
    description: "Replay execution proof and artifacts",
  },
  {
    href: "/architecture",
    label: "Architecture Proof",
    description: "Trace the runtime plan for judges",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-white/10 bg-black/35 px-5 py-6 backdrop-blur-xl lg:flex lg:flex-col">
      <Link href="/" className="group block rounded-lg border border-white/10 bg-white/[0.055] p-4 shadow-2xl shadow-black/30">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-teal-300/35 bg-teal-300/12 text-sm font-semibold text-teal-100 shadow-lg shadow-teal-950/30">
            FP
          </div>
          <div>
            <p className="text-sm font-semibold text-white">ForgePilot</p>
            <p className="text-xs text-white/60">Autopilot Runtime</p>
          </div>
        </div>
      </Link>

      <nav className="mt-8 space-y-2">
        {navigationItems.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group block rounded-lg border px-4 py-3 transition",
                isActive
                  ? "border-teal-300/35 bg-teal-300/12 text-white shadow-lg shadow-teal-950/30"
                  : "border-transparent text-white/70 hover:border-white/12 hover:bg-white/[0.055] hover:text-white",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium">{item.label}</span>
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    isActive ? "bg-teal-300" : "bg-white/22 group-hover:bg-white/50",
                  )}
                />
              </div>
              <p className="mt-1 text-xs leading-5 text-white/52">{item.description}</p>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-lg border border-white/10 bg-white/[0.045] p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/46">
            Runtime Mode
          </p>
          <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-2 py-1 text-[10px] font-semibold text-emerald-200">
            LOCAL
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-white/64">
          Designed for Qwen-powered plans, human approval gates, and artifact-first output.
        </p>
        <Link
          href="/run/demo"
          className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg border border-teal-300/25 bg-teal-300/10 text-sm font-semibold text-teal-100 transition hover:bg-teal-300/15"
        >
          View flight recorder
        </Link>
      </div>
    </aside>
  );
}
