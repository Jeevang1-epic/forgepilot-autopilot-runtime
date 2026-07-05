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
  scheduled: "Scheduled Demo",
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
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/38">
            Recent Runs
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Flight history</h2>
        </div>
        <Link href="/run/demo" className="text-sm font-medium text-teal-200 hover:text-teal-100">
          Open demo recorder
        </Link>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {runs.slice(0, 3).map((run) => (
          <article
            key={run.id}
            className="rounded-lg border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            <div className="flex items-start justify-between gap-3">
              <span className={cn("rounded-full border px-2.5 py-1 text-xs", statusTone[run.status])}>
                {statusLabel[run.status]}
              </span>
              <span className="font-mono text-xs text-white/36">{run.id}</span>
            </div>

            <h3 className="mt-5 text-lg font-semibold text-white">{run.title}</h3>
            <p className="mt-3 min-h-16 text-sm leading-6 text-white/54">{run.summary}</p>

            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/34">Trigger</p>
              <p className="mt-2 text-sm text-white/72">{triggerLabel[run.triggerType]}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
