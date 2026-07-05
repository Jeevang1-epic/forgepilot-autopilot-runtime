const runtimeStages = [
  {
    label: "Trigger Engine",
    description: "Accepts manual commands, webhook payloads, or scheduled demo events.",
    checkpoint: "normalizes intent",
  },
  {
    label: "Qwen Planner",
    description: "Converts messy intent into a structured execution plan with risk notes.",
    checkpoint: "planned integration",
  },
  {
    label: "Runtime Executor",
    description: "Steps through the plan, dispatches tools, and records every transition.",
    checkpoint: "orchestrates",
  },
  {
    label: "Tool Registry",
    description: "Defines allowed local tools, inputs, outputs, and safety boundaries.",
    checkpoint: "scoped tools",
  },
  {
    label: "Approval Gate",
    description: "Pauses high-risk actions until the human operator approves them.",
    checkpoint: "human control",
  },
  {
    label: "Artifact Writer",
    description: "Writes reviewed markdown, JSON reports, and scripts to local paths.",
    checkpoint: "local output",
  },
  {
    label: "Flight Recorder",
    description: "Seals the timeline with status, tool calls, approvals, and artifacts.",
    checkpoint: "full proof",
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
        </div>
        <span className="w-fit rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white/56">
          local-first foundation
        </span>
      </div>

      <div className="mt-6 grid gap-3 xl:grid-cols-7">
        {runtimeStages.map((stage, index) => (
          <div key={stage.label} className="relative">
            <div className="flex h-full flex-col rounded-lg border border-white/10 bg-black/25 p-4">
              <p className="font-mono text-xs text-white/34">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 text-base font-semibold text-white">{stage.label}</h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-white/52">{stage.description}</p>
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
