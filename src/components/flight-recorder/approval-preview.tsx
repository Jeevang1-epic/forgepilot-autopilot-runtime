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
    <section className="rounded-lg border border-amber-200/20 bg-amber-200/[0.055] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-100/70">
            Human-in-the-loop
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">{approval.title}</h2>
          <p className="mt-2 text-sm leading-6 text-white/58">{approval.summary}</p>
        </div>
        <span className={cn("w-fit rounded-full border px-3 py-1.5 text-xs", riskTone[approval.riskLevel])}>
          {approval.riskLevel} risk
        </span>
      </div>

      <div className="mt-5 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/34">Status</p>
          <p className="mt-2 text-sm font-medium capitalize text-white/72">{approval.status}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/34">Approver</p>
          <p className="mt-2 text-sm text-white/72">{approval.approver ?? "Pending"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/34">Requested</p>
          <p className="mt-2 font-mono text-sm text-white/72">
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
    </section>
  );
}
