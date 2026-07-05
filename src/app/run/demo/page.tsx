import { ArtifactPanel } from "@/components/flight-recorder/artifact-panel";
import { ApprovalPreview } from "@/components/flight-recorder/approval-preview";
import { FlightTimeline } from "@/components/flight-recorder/flight-timeline";
import { ToolCallCard } from "@/components/flight-recorder/tool-call-card";
import { demoRun } from "@/lib/runtime/sample-runs";

export default function DemoRunPage() {
  const [approval] = demoRun.approvalRequests;

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-black/25 p-6 shadow-2xl shadow-black/30 sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/70">
              Run Overview
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {demoRun.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/66">{demoRun.summary}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[32rem]">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/42">Status</p>
              <p className="mt-2 text-sm font-semibold capitalize text-emerald-100">
                {demoRun.status.replace("_", " ")}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/42">Tool calls</p>
              <p className="mt-2 font-mono text-xl font-semibold text-white">
                {demoRun.toolCalls.length}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/42">Artifacts</p>
              <p className="mt-2 font-mono text-xl font-semibold text-white">
                {demoRun.artifacts.length}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row">
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-teal-200 px-4 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-950/20 transition hover:bg-teal-100"
          >
            Run Replay
          </button>
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-white/12 bg-white/[0.055] px-4 text-sm font-semibold text-white/78 transition hover:border-white/20 hover:bg-white/[0.08]"
          >
            Export Run Report
          </button>
        </div>
      </section>

      {approval ? <ApprovalPreview approval={approval} /> : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="space-y-6">
          <FlightTimeline steps={demoRun.timeline} />

          <section className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/70">
                  Runtime Proof
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Tool calls and outputs</h2>
              </div>
              <span className="w-fit rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white/66">
                {demoRun.toolCalls.length} recorded calls
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {demoRun.toolCalls.map((toolCall) => (
                <ToolCallCard key={toolCall.id} toolCall={toolCall} />
              ))}
            </div>
          </section>
        </div>
        <ArtifactPanel artifacts={demoRun.artifacts} />
      </div>
    </div>
  );
}
