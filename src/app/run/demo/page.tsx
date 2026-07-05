import { ArtifactPanel } from "@/components/flight-recorder/artifact-panel";
import { ApprovalPreview } from "@/components/flight-recorder/approval-preview";
import { FlightTimeline } from "@/components/flight-recorder/flight-timeline";
import { demoRun } from "@/lib/runtime/sample-runs";

export default function DemoRunPage() {
  const [approval] = demoRun.approvalRequests;

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-black/25 p-6 shadow-2xl shadow-black/30 sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/70">
              Demo Run
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {demoRun.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/60">{demoRun.summary}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[30rem]">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/34">Status</p>
              <p className="mt-2 text-sm font-semibold capitalize text-emerald-100">
                {demoRun.status.replace("_", " ")}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/34">Tool calls</p>
              <p className="mt-2 font-mono text-xl font-semibold text-white">
                {demoRun.toolCalls.length}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/34">Artifacts</p>
              <p className="mt-2 font-mono text-xl font-semibold text-white">
                {demoRun.artifacts.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {approval ? <ApprovalPreview approval={approval} /> : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <FlightTimeline steps={demoRun.timeline} />
        <ArtifactPanel artifacts={demoRun.artifacts} />
      </div>
    </div>
  );
}
