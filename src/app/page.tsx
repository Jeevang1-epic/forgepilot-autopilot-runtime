import { CommandCenter } from "@/components/command/command-center";
import { RecentRuns } from "@/components/command/recent-runs";
import { StatGrid } from "@/components/command/stat-grid";
import { recentRuns, runtimeStats } from "@/lib/runtime/sample-runs";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr] xl:items-stretch">
        <div className="flex min-h-[34rem] flex-col justify-between rounded-lg border border-white/10 bg-black/25 p-6 shadow-2xl shadow-black/30 sm:p-8">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-teal-300/30 bg-teal-300/10 px-3 py-1.5 text-xs font-medium text-teal-100">
                Qwen Cloud Hackathon
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/58">
                Track 4 Autopilot Agent
              </span>
            </div>

            <h1 className="mt-8 max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              One command. Real workflow. Full proof.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/62">
              ForgePilot is a local-first autopilot runtime for solo builders. It turns
              one messy command into a planned workflow with tool execution, human
              approval, local artifacts, and a Flight Recorder timeline.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {["Trigger", "Approval Gate", "Artifacts"].map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/34">Runtime</p>
                <p className="mt-2 text-sm font-medium text-white/72">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <CommandCenter />
      </section>

      <StatGrid stats={runtimeStats} />
      <RecentRuns runs={recentRuns} />
    </div>
  );
}
