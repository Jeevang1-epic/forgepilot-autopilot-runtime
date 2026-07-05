import type { ApprovalRequest, RiskLevel } from "@/lib/runtime/types";
import { cn } from "@/lib/utils";

const riskTone: Record<RiskLevel, string> = {
  low: "border-emerald-200/30 bg-emerald-200/10 text-emerald-100",
  medium: "border-cyan-200/30 bg-cyan-200/10 text-cyan-100",
  high: "border-amber-200/30 bg-amber-200/10 text-amber-100",
};

type ApprovalPreviewProps = {
  approval: ApprovalRequest;
};

export function ApprovalPreview({ approval }: ApprovalPreviewProps) {
  return (
    <section className="rounded-lg border border-amber-200/25 bg-amber-200/[0.065] p-5 shadow-2xl shadow-amber-950/10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-100/70">
            Approval Checkpoint
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Awaiting approval</h2>
          <p className="mt-2 text-sm leading-6 text-white/66">{approval.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="w-fit rounded-full border border-amber-200/40 bg-amber-200/12 px-3 py-1.5 text-xs font-semibold text-amber-100">
            awaiting approval
          </span>
          <span className={cn("w-fit rounded-full border px-3 py-1.5 text-xs", riskTone[approval.riskLevel])}>
            {approval.riskLevel} risk
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/42">Gate</p>
          <p className="mt-2 text-sm font-medium text-white/78">{approval.title}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/42">Current status</p>
          <p className="mt-2 text-sm text-white/78">
            Replay checkpoint, no action executed in this demo UI
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/42">Requested</p>
          <p className="mt-2 font-mono text-sm text-white/78">
            {new Intl.DateTimeFormat("en", {
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "UTC",
              hour12: false,
            }).format(new Date(approval.requestedAt))}{" "}
            UTC
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center rounded-lg bg-emerald-200 px-4 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-100"
        >
          Approve artifact write
        </button>
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center rounded-lg border border-rose-200/25 bg-rose-200/10 px-4 text-sm font-semibold text-rose-100 transition hover:bg-rose-200/15"
        >
          Reject and revise plan
        </button>
      </div>
    </section>
  );
}
