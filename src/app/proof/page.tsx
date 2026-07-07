import Link from "next/link";

const runtimeFlow = [
  "Manual or webhook trigger",
  "Qwen planner or tool selector",
  "App-owned tool execution",
  "Typed local registry validation",
  "Human approval gate",
  "Artifact generation after approval",
  "Flight Recorder proof trail",
];

const implemented = [
  "Command Center, Flight Recorder, Trigger Lab, Architecture, and Proof Pack routes",
  "Local runtime engine with typed runs, tool calls, approvals, artifacts, and reports",
  "Qwen planner adapter with JSON validation, repair, and local fallback",
  "Qwen tool-selection adapter with local registry validation",
  "OpenAI-compatible tool manifest generated from local registered tools",
  "App-owned execution through registered local tools only",
  "Human approval gate before final artifact generation",
  "Artifact objects generated only after approval",
  "Webhook trigger route with optional shared-secret header",
  "Runtime and Qwen health endpoints",
];

const planned = [
  "Credentialed Qwen Cloud verification with final env vars",
  "Optional live n8n workflow connected to the webhook route",
  "Alibaba Function Compute proof path",
  "Durable artifact export and storage",
  "Persistent run history beyond the in-memory MVP store",
  "Real external connectors after stronger auth, approval, and audit controls",
];

const proofSections = [
  {
    title: "What ForgePilot is",
    status: "implemented",
    body: "ForgePilot is a local-first autopilot runtime for solo builders. It turns one messy builder goal into a typed workflow with planning, local tool execution, approval, artifacts, and proof.",
  },
  {
    title: "Why it is not a chatbot",
    status: "implemented",
    body: "The command input is only the trigger surface. The durable unit is a run with plan steps, tool calls, approval requests, artifact objects, timestamps, warnings, and a report.",
  },
  {
    title: "Qwen Cloud integration proof",
    status: "implemented foundation",
    body: "Server-side Qwen adapters can request structured plans or next-tool selections when env vars are configured. Responses are validated locally, and auto mode falls back safely when credentials are missing.",
  },
  {
    title: "Tool-calling safety proof",
    status: "implemented",
    body: "Qwen may select a tool, but ForgePilot validates the tool name and arguments against the typed local registry. Qwen never receives executable functions and never executes local tools directly.",
  },
  {
    title: "Webhook trigger proof",
    status: "implemented",
    body: "POST /api/webhooks/forgepilot accepts validated JSON from manual tests, n8n, or external callers. Public deployments should configure FORGEPILOT_WEBHOOK_SECRET.",
  },
  {
    title: "Human approval proof",
    status: "implemented",
    body: "The runtime pauses at awaiting_approval before final artifact generation. Approve/reject decisions are recorded, and rejections stop the run safely.",
  },
  {
    title: "Artifact proof",
    status: "implemented",
    body: "Artifacts appear only after approval: submission pack, demo script, LinkedIn draft, architecture summary, and run-report JSON.",
  },
  {
    title: "Fallback proof",
    status: "implemented",
    body: "When Qwen env vars are not configured, auto mode records local_fallback and still demonstrates the full safe runtime loop up to approval.",
  },
];

const apiEndpoints = [
  "GET /api/qwen/health",
  "GET /api/runs/health",
  "POST /api/runs/demo",
  "POST /api/qwen/plan",
  "POST /api/qwen/tool-call",
  "POST /api/webhooks/forgepilot",
  "POST /api/approvals",
  "GET /api/runs/[id]",
];

const devpostChecklist = [
  "Track 4: Autopilot Agent is clearly named",
  "One-line pitch explains runtime automation",
  "Qwen usage is described as env-driven and server-side",
  "No fake API keys or fake external automations are claimed",
  "Approval gate is shown before artifact writing",
  "Webhook trigger and Trigger Lab are shown",
  "Known MVP limits are stated honestly",
];

const videoPath = [
  "Open Command Center",
  "Start Auto planner and Auto execution run",
  "Show Runtime Brain metadata",
  "Show Flight Recorder tool cards",
  "Show artifacts absent before approval",
  "Approve checkpoint",
  "Show artifacts and run report",
  "Send test webhook from Trigger Lab",
  "Close on Proof Pack and Architecture",
];

const finalSubmissionChecklist = [
  "Public GitHub repo",
  "MIT LICENSE visible",
  "README complete",
  "Deployment URL ready",
  "Qwen env tested or fallback explained",
  "Architecture page included",
  "Demo video under 3 minutes",
  "Devpost text ready",
  "Proof Pack route included",
  "Health routes tested",
  "No forbidden marker files",
  "No secrets committed",
  "Lint, build, and audit passing",
];

export default function ProofPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-black/25 p-6 shadow-2xl shadow-black/30 sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/70">
              Submission Proof Pack
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Judge-ready proof for a local-first autopilot runtime.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-white/66">
              ForgePilot demonstrates the core Track 4 loop: trigger, Qwen-ready
              planner or tool selector, app-owned local execution, approval gate,
              artifact generation, and Flight Recorder proof. This page separates
              what is implemented today from what remains planned.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[24rem]">
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
        </div>
      </section>

      <section className="rounded-lg border border-teal-200/18 bg-teal-200/[0.055] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-100/75">
          Runtime Flow
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          From trigger to proof
        </h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-7">
          {runtimeFlow.map((step, index) => (
            <div key={step} className="rounded-lg border border-white/10 bg-black/25 p-3">
              <p className="font-mono text-xs text-white/42">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-white/74">
                {step}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-lg border border-teal-200/18 bg-teal-200/[0.055] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-100/75">
            Implemented
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Built into the submission foundation
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
            Planned
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Next proof after submission
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
        {proofSections.map((section) => (
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
            API Endpoint Checklist
          </p>
          <div className="mt-4 space-y-2">
            {apiEndpoints.map((endpoint) => (
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
            Devpost Submission Checklist
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

        <article className="rounded-lg border border-white/10 bg-black/25 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/70">
            Demo Video Path
          </p>
          <div className="mt-4 space-y-3">
            {videoPath.map((item, index) => (
              <div key={item} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-teal-100/25 bg-teal-100/10 font-mono text-[11px] text-teal-50">
                  {index + 1}
                </span>
                <p className="text-sm leading-6 text-white/68">{item}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/70">
              Final Submission Checklist
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Last pass before Devpost
            </h2>
          </div>
          <span className="w-fit rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white/66">
            public submission ready
          </span>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {finalSubmissionChecklist.map((item) => (
            <div key={item} className="rounded-lg border border-white/10 bg-black/25 p-3">
              <p className="text-sm font-medium leading-6 text-white/72">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
