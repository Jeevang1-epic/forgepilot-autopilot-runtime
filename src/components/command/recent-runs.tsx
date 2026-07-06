import Link from "next/link";

import type { ForgePilotRun, RunStatus, TriggerType } from "@/lib/runtime/types";
import { cn } from "@/lib/utils";

const statusLabel: Record<RunStatus, string> = {
  queued: "Queued",
  planning: "Planning",
  running: "Running",
  awaiting_approval: "Awaiting Approval",
  completed: "Completed",
  failed: "Failed",
};

const triggerLabel: Record<TriggerType, string> = {
  manual: "Manual Command",
  webhook: "Webhook Trigger",
  scheduled_demo: "Scheduled Demo",
};

const statusTone: Record<RunStatus, string> = {
  queued: "border-white/10 bg-white/[0.05] text-white/62",
  planning: "border-cyan-200/30 bg-cyan-200/10 text-cyan-100",
  running: "border-teal-200/30 bg-teal-200/10 text-teal-100",
  awaiting_approval: "border-amber-200/30 bg-amber-200/10 text-amber-100",
  completed: "border-emerald-200/30 bg-emerald-200/10 text-emerald-100",
  failed: "border-rose-200/30 bg-rose-200/10 text-rose-100",
};

type RecentRunsProps = {
  runs: ForgePilotRun[];
};

export function RecentRuns({ runs }: RecentRunsProps) {
  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/46">
            Recent Runs
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Flight history</h2>
        </div>
        <Link
          href="/run/demo"
          className="w-fit rounded-full border border-teal-300/25 bg-teal-300/10 px-3 py-2 text-sm font-medium text-teal-100 transition hover:bg-teal-300/15"
        >
          Open demo recorder
        </Link>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {runs.slice(0, 3).map((run) => (
          <article
            key={run.id}
            className="flex min-h-72 flex-col rounded-lg border border-white/10 bg-white/[0.045] p-5 transition hover:border-white/20 hover:bg-white/[0.065]"
          >
            <div className="flex items-start justify-between gap-3">
              <span className={cn("rounded-full border px-2.5 py-1 text-xs", statusTone[run.status])}>
                {statusLabel[run.status]}
              </span>
              <span className="font-mono text-xs text-white/46">{run.id}</span>
            </div>

            <h3 className="mt-5 text-lg font-semibold text-white">{run.title}</h3>
            <p className="mt-3 text-sm leading-6 text-white/62">{run.summary}</p>

            <div className="mt-auto border-t border-white/10 pt-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/42">Trigger</p>
                  <p className="mt-2 text-sm text-white/78">{triggerLabel[run.triggerType]}</p>
                </div>
                <Link
                  href="/run/demo"
                  className="shrink-0 rounded-full border border-white/12 bg-black/25 px-3 py-1.5 text-xs font-medium text-white/72 transition hover:border-teal-300/30 hover:text-teal-100"
                >
                  View flight recorder
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
