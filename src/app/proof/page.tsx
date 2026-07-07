import Link from "next/link";

const implemented = [
  "Local runtime engine with typed runs, tool calls, approvals, artifacts, and reports",
  "Qwen planner adapter with schema validation, JSON repair, and safe local fallback",
  "Qwen tool-selection adapter that validates selected tools against the local registry",
  "App-owned execution through registered local tools only",
  "Human approval gate before final artifact generation",
  "Artifact objects generated only after approval",
  "Flight Recorder timeline, tool-call cards, and run report metadata",
  "Inbound webhook route for manual, n8n, and external trigger payloads",
  "Trigger Lab UI for local webhook smoke tests",
  "Health endpoints for runtime and Qwen configuration proof",
  "Fallback modes for missing Qwen env vars",
];

const planned = [
  "Optional live n8n workflow template connected to the webhook bridge",
  "Alibaba Function Compute deployment proof path",
  "Durable artifact export and download flow",
  "Persistent run storage beyond the in-memory MVP store",
  "Real external connectors only after stronger approval and auth boundaries",
];

const sections = [
  {
    title: "What ForgePilot does",
    body: "ForgePilot turns a messy goal into a local automation run: trigger intake, planner resolution, tool execution, approval checkpoint, generated artifacts, and a Flight Recorder report. The app is built around runtime proof instead of chat history.",
    status: "implemented",
  },
  {
    title: "Runtime flow",
    body: "Trigger Engine -> Qwen Planner -> Runtime Executor -> Tool Registry -> Approval Gate -> Artifact Writer -> Flight Recorder. The same flow is used for manual commands, demo runs, and webhook-triggered runs.",
    status: "implemented",
  },
  {
    title: "Qwen Cloud integration proof",
    body: "Server-side adapters read Qwen env vars, request structured plans or next-tool selections when configured, validate responses, record metadata, and fall back locally in auto mode. This foundation does not claim a live production Qwen account is already configured.",
    status: "implemented foundation",
  },
  {
    title: "Tool-calling safety proof",
    body: "Qwen can select tools, but ForgePilot validates names and arguments against the typed local registry. Unknown tools, invalid arguments, unsupported tool-call types, and unsafe artifact-writing attempts are blocked or routed to local fallback.",
    status: "implemented",
  },
  {
    title: "Webhook trigger proof",
    body: "POST /api/webhooks/forgepilot accepts validated JSON from manual tests, n8n, or external callers. It creates a webhook-triggered run and returns normalized run metadata without bypassing local approval gates. Production deployments should configure FORGEPILOT_WEBHOOK_SECRET.",
    status: "implemented",
  },
  {
    title: "Human approval proof",
    body: "The demo runtime pauses at awaiting_approval and exposes approve/reject UI controls. Final artifact writing is blocked until the approval request is approved.",
    status: "implemented",
  },
  {
    title: "Artifact generation proof",
    body: "After approval, ForgePilot creates local runtime artifact objects for submission copy, demo script, LinkedIn draft, architecture summary, and run report JSON.",
    status: "implemented",
  },
  {
    title: "Local fallback proof",
    body: "Without Qwen env vars, auto mode records a local fallback and still completes the safe demo path up to approval. The judge demo remains functional without fake keys.",
    status: "implemented",
  },
];

const endpoints = [
  "GET /api/runs/health",
  "GET /api/qwen/health",
  "POST /api/runs/demo",
  "POST /api/qwen/tool-call",
  "POST /api/webhooks/forgepilot",
  "POST /api/approvals",
  "GET /api/runs/[id]",
];

const demoScriptOutline = [
  "Open the Command Center and start one autopilot run.",
  "Show Runtime Brain metadata and local fallback behavior.",
  "Show tool-call proof cards and the awaiting approval checkpoint.",
  "Approve the final artifact pack and show generated artifacts.",
  "Open Trigger Lab and send a webhook payload.",
  "Close on the Proof Pack and architecture flow.",
];

const devpostChecklist = [
  "Track 4: Autopilot Agent is named clearly.",
  "Project is positioned as workflow automation, not a chatbot.",
  "Qwen Cloud integration is described accurately as adapter-ready and env-driven.",
  "Tool execution boundary and approval gate are explained.",
  "Webhook bridge and Trigger Lab are included as proof surfaces.",
  "No fake credentials or live deployment claims are made.",
];

export default function ProofPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-black/25 p-6 shadow-2xl shadow-black/30 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/70">
          Submission Proof Pack
        </p>
        <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Submission Proof Pack
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-white/66">
          A judge-facing snapshot of what ForgePilot can demonstrate today:
          local-first autopilot execution, Qwen-ready planning and tool selection,
          webhook triggers, approval safety, artifact generation, and a Flight
          Recorder timeline.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/run/demo"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-teal-200 px-4 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-950/20 transition hover:bg-teal-100"
          >
            Open Flight Recorder
          </Link>
          <Link
            href="/triggers"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-white/12 bg-white/[0.055] px-4 text-sm font-semibold text-white/78 transition hover:border-white/20 hover:bg-white/[0.08]"
          >
            Open Trigger Lab
          </Link>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-lg border border-teal-200/18 bg-teal-200/[0.055] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-100/75">
            Implemented
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Built into the foundation
          </h2>
          <div className="mt-5 space-y-3">
            {implemented.map((item) => (
              <div key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-200" />
                <p className="text-sm leading-6 text-white/70">{item}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/46">
            Planned Next
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Honest next-phase scope
          </h2>
          <div className="mt-5 space-y-3">
            {planned.map((item) => (
              <div key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-200" />
                <p className="text-sm leading-6 text-white/70">{item}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {sections.map((section) => (
          <article
            key={section.title}
            className="rounded-lg border border-white/10 bg-white/[0.045] p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">{section.title}</h2>
              <span className="shrink-0 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/58">
                {section.status}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-white/66">{section.body}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-lg border border-white/10 bg-black/25 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/70">
            API Endpoints
          </p>
          <div className="mt-4 space-y-2">
            {endpoints.map((endpoint) => (
              <p
                key={endpoint}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-xs text-white/72"
              >
                {endpoint}
              </p>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-white/10 bg-black/25 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/70">
            Demo Script Outline
          </p>
          <div className="mt-4 space-y-3">
            {demoScriptOutline.map((item, index) => (
              <div key={item} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-teal-100/25 bg-teal-100/10 font-mono text-[11px] text-teal-50">
                  {index + 1}
                </span>
                <p className="text-sm leading-6 text-white/68">{item}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-white/10 bg-black/25 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/70">
            Devpost Checklist
          </p>
          <div className="mt-4 space-y-3">
            {devpostChecklist.map((item) => (
              <div key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-200" />
                <p className="text-sm leading-6 text-white/68">{item}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
