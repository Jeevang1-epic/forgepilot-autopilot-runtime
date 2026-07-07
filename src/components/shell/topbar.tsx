"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { navigationItems } from "./sidebar";

const pageLabels: Record<string, string> = {
  "/": "Home Command Center",
  "/run/demo": "Live Flight Recorder",
  "/triggers": "Trigger Lab",
  "/architecture": "Architecture Proof",
  "/proof": "Submission Proof Pack",
};

export function Topbar() {
  const pathname = usePathname();
  const pageLabel = pageLabels[pathname] ?? "ForgePilot Runtime";

  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-[#050608]/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-teal-200/70">
              ForgePilot
            </p>
            <h1 className="mt-1 text-lg font-semibold text-white sm:text-xl">{pageLabel}</h1>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/64">
              Track 4: Autopilot Agent
            </span>
            <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1.5 text-xs font-medium text-emerald-200">
              Demo ready
            </span>
          </div>
        </div>

        <div className="hidden items-center justify-between gap-3 lg:flex">
          <div className="flex gap-2">
            {navigationItems.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    isActive
                      ? "border-teal-300/35 bg-teal-300/12 text-teal-100"
                      : "border-white/10 bg-white/[0.035] text-white/62 hover:border-white/20 hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <Link
            href="/run/demo"
            className="rounded-full bg-teal-200 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-lg shadow-teal-950/20 transition hover:bg-teal-100"
          >
            Run Replay
          </Link>
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
          {navigationItems.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-2 text-xs font-medium transition",
                  isActive
                    ? "border-teal-300/30 bg-teal-300/10 text-teal-100"
                    : "border-white/10 bg-white/[0.035] text-white/58",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
