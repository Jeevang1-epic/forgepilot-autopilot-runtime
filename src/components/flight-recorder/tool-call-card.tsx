import type { RiskLevel, ToolCall, ToolCallStatus } from "@/lib/runtime/types";
import { cn } from "@/lib/utils";

const statusTone: Record<ToolCallStatus, string> = {
  queued: "border-white/12 bg-white/[0.06] text-white/70",
  running: "border-cyan-200/30 bg-cyan-200/10 text-cyan-100",
  completed: "border-emerald-200/30 bg-emerald-200/10 text-emerald-100",
  failed: "border-rose-200/30 bg-rose-200/10 text-rose-100",
};

const riskTone: Record<RiskLevel, string> = {
  low: "border-emerald-200/25 bg-emerald-200/10 text-emerald-100",
  medium: "border-cyan-200/25 bg-cyan-200/10 text-cyan-100",
  high: "border-amber-200/30 bg-amber-200/10 text-amber-100",
};

type ToolCallCardProps = {
  toolCall: ToolCall;
};

export function ToolCallCard({ toolCall }: ToolCallCardProps) {
  return (
    <article className="rounded-lg border border-white/10 bg-black/25 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/46">Tool call</p>
          <h3 className="mt-2 font-mono text-base font-semibold text-white">
            {toolCall.name}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={cn("rounded-full border px-2.5 py-1 text-xs capitalize", statusTone[toolCall.status])}>
            {toolCall.status}
          </span>
          <span className={cn("rounded-full border px-2.5 py-1 text-xs", riskTone[toolCall.riskLevel])}>
            {toolCall.riskLevel} risk
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
          <p className="text-xs uppercase tracking-[0.18em] text-white/42">Input</p>
          <p className="mt-2 text-sm leading-6 text-white/66">{toolCall.inputSummary}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
          <p className="text-xs uppercase tracking-[0.18em] text-white/42">Output</p>
          <p className="mt-2 text-sm leading-6 text-white/66">
            {toolCall.outputSummary ?? "No output recorded yet."}
          </p>
        </div>
      </div>
    </article>
  );
}
