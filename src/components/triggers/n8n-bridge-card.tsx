const bridgeSteps = [
  "Create an n8n Webhook trigger with POST JSON input.",
  "Send the payload fields goal, source, plannerMode, executionMode, and metadata.",
  "Point the HTTP Request node to /api/webhooks/forgepilot during local demo testing.",
  "Add x-forgepilot-secret only when FORGEPILOT_WEBHOOK_SECRET is configured.",
  "Store the returned runId and open runUrl for Flight Recorder proof.",
];

const safetyFacts = [
  "The webhook creates a ForgePilot run; it does not bypass local planning or validation.",
  "Qwen can plan or select tools when configured, but the local runtime executes only registered tools.",
  "Final artifact writing remains blocked until a human approval checkpoint is approved.",
];

export function N8nBridgeCard() {
  return (
    <section className="rounded-lg border border-cyan-200/18 bg-cyan-200/[0.05] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/75">
            n8n Bridge
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Inbound automation without unsafe execution
          </h2>
        </div>
        <span className="w-fit rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white/66">
          bridge-ready
        </span>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-lg border border-white/10 bg-black/25 p-4">
          <p className="text-sm font-semibold text-white">n8n setup outline</p>
          <div className="mt-4 space-y-3">
            {bridgeSteps.map((step, index) => (
              <div key={step} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cyan-100/25 bg-cyan-100/10 font-mono text-[11px] text-cyan-50">
                  {index + 1}
                </span>
                <p className="text-sm leading-6 text-white/68">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/25 p-4">
          <p className="text-sm font-semibold text-white">Safety contract</p>
          <div className="mt-4 space-y-3">
            {safetyFacts.map((fact) => (
              <div key={fact} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-200" />
                <p className="text-sm leading-6 text-white/68">{fact}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
