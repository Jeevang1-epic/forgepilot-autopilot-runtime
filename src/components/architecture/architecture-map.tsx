const runtimeStages = [
  {
    label: "Trigger Engine",
    description: "Accepts manual commands, webhook payloads, or scheduled demo events.",
    checkpoint: "normalizes intent",
    state: "implemented",
  },
  {
    label: "Qwen Planner",
    description: "Calls Qwen Cloud for structured plans when configured, with safe local fallback.",
    checkpoint: "planner adapter",
    state: "implemented",
  },
  {
    label: "Runtime Executor",
    description: "Steps through the plan, dispatches tools, and records every transition.",
    checkpoint: "local executor",
    state: "implemented",
  },
  {
    label: "Tool Registry",
    description: "Defines allowed local tools, inputs, schemas, risk, and approval flags.",
    checkpoint: "scoped tools",
    state: "implemented",
  },
  {
    label: "Approval Gate",
    description: "Pauses the run before final artifact generation until the user decides.",
    checkpoint: "human control",
    state: "implemented",
  },
  {
    label: "Artifact Writer",
    description: "Creates safe runtime artifact objects without relying on server files.",
    checkpoint: "state artifacts",
    state: "implemented",
  },
  {
    label: "Flight Recorder",
    description: "Seals the timeline with status, tool calls, approvals, and artifacts.",
    checkpoint: "full proof",
    state: "implemented",
  },
];

export function ArchitectureMap() {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/25 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/70">
            Runtime Flow
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Trigger to proof, end to end</h2>
          <p className="mt-3 max-w-4xl font-mono text-sm leading-6 text-white/70">
            Trigger Engine → Qwen Planner → Runtime Executor → Tool Registry → Approval Gate → Artifact Writer → Flight Recorder
          </p>
        </div>
        <span className="w-fit rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white/66">
          local-first foundation
        </span>
      </div>

      <div className="mt-6 grid gap-3 xl:grid-cols-7">
        {runtimeStages.map((stage, index) => (
          <div key={stage.label} className="relative">
            <div className="flex h-full flex-col rounded-lg border border-white/10 bg-black/28 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-xs text-white/46">{String(index + 1).padStart(2, "0")}</p>
                <span className="rounded-full border border-white/10 bg-white/[0.045] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/58">
                  {stage.state}
                </span>
              </div>
              <h3 className="mt-3 text-base font-semibold text-white">{stage.label}</h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-white/62">{stage.description}</p>
              <span className="mt-4 w-fit rounded-full border border-teal-200/20 bg-teal-200/10 px-2.5 py-1 text-[11px] font-medium text-teal-100">
                {stage.checkpoint}
              </span>
            </div>

            {index < runtimeStages.length - 1 ? (
              <div className="hidden xl:block">
                <div className="absolute -right-3 top-1/2 z-10 h-px w-6 bg-teal-200/40" />
                <div className="absolute -right-3.5 top-[calc(50%-3px)] z-10 h-1.5 w-1.5 rotate-45 border-r border-t border-teal-200/50" />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
