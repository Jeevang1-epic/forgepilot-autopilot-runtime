import type { RiskLevel, TimelineStep, TimelineStepStatus } from "@/lib/runtime/types";
import { cn } from "@/lib/utils";

const statusLabel: Record<TimelineStepStatus, string> = {
  pending: "Pending",
  running: "Running",
  completed: "Completed",
  blocked: "Blocked",
  approval_required: "Approval Required",
};

const statusTone: Record<TimelineStepStatus, string> = {
  pending: "border-white/12 bg-white/[0.06] text-white/70",
  running: "border-cyan-200/30 bg-cyan-200/10 text-cyan-100",
  completed: "border-emerald-200/30 bg-emerald-200/10 text-emerald-100",
  blocked: "border-rose-200/30 bg-rose-200/10 text-rose-100",
  approval_required: "border-amber-200/35 bg-amber-200/12 text-amber-100",
};

const riskTone: Record<RiskLevel, string> = {
  low: "border-emerald-200/20 bg-emerald-200/10 text-emerald-100",
  medium: "border-cyan-200/20 bg-cyan-200/10 text-cyan-100",
  high: "border-amber-200/30 bg-amber-200/10 text-amber-100",
};

function formatTime(timestamp: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
    hour12: false,
  }).format(new Date(timestamp));
}

type TimelineStepCardProps = {
  step: TimelineStep;
  index: number;
};

export function TimelineStepCard({ step, index }: TimelineStepCardProps) {
  return (
    <article
      className={cn(
        "relative rounded-lg border border-white/10 bg-white/[0.05] p-5 shadow-xl shadow-black/20",
        step.status === "approval_required" &&
          "border-amber-200/25 bg-amber-200/[0.065] shadow-amber-950/20",
      )}
    >
      <div
        className={cn(
          "absolute -left-[2.15rem] top-6 hidden h-4 w-4 rounded-full border bg-[#06110f] lg:block",
          step.status === "approval_required"
            ? "border-amber-200/75 shadow-[0_0_0_6px_rgba(251,191,36,0.12)]"
            : "border-teal-200/60 shadow-[0_0_0_6px_rgba(45,212,191,0.08)]",
        )}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs text-white/46">
            STEP {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-white">{step.title}</h3>
          <p className="mt-2 text-sm leading-6 text-white/64">{step.description}</p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
          <span className={cn("rounded-full border px-2.5 py-1 text-xs", statusTone[step.status])}>
            {statusLabel[step.status]}
          </span>
          {step.riskLevel ? (
            <span className={cn("rounded-full border px-2.5 py-1 text-xs", riskTone[step.riskLevel])}>
              {step.riskLevel} risk
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-5 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/42">Timestamp</p>
          <p className="mt-2 font-mono text-sm text-white/78">{formatTime(step.timestamp)} UTC</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/42">Tool</p>
          <p className="mt-2 font-mono text-sm text-white/78">{step.toolName ?? "runtime.event"}</p>
        </div>
      </div>
    </article>
  );
}
