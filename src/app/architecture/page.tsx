import { ArchitectureMap } from "@/components/architecture/architecture-map";
import { ProofSection } from "@/components/architecture/proof-section";

const proofSections = [
  {
    eyebrow: "Differentiator",
    title: "Why this is not a chatbot",
    body: "ForgePilot is shaped around execution records, tool boundaries, approvals, and artifacts. The chat-like command is only the trigger surface.",
    points: [
      "Every run is represented as a typed workflow with status, tools, approvals, and outputs.",
      "The Flight Recorder turns automation into inspectable proof rather than transient conversation.",
      "The UI emphasizes runtime state and generated files instead of an endless message thread.",
    ],
  },
  {
    eyebrow: "Planner",
    title: "Qwen Cloud planner and selector adapter",
    body: "The runtime can request structured plans or next-tool selections from Qwen when env vars are configured, then validate or safely fall back before execution.",
    points: [
      "Qwen can plan or select the next tool; ForgePilot still owns execution.",
      "Planner and tool-call responses are validated against local schemas and known tool names.",
      "Auto mode falls back to deterministic local behavior if Qwen is not configured or output is invalid.",
    ],
  },
  {
    eyebrow: "Execution",
    title: "Tool-calling runtime",
    body: "The runtime dispatches only local registered tools with schemas, allowed effects, risk levels, and output contracts. Qwen never receives executable functions.",
    points: [
      "Qwen tool selections are validated before the runtime executes a local tool.",
      "Local tools handle scanning, writing, checklist generation, and report assembly.",
      "Final artifact writing remains blocked until the Approval Gate is approved.",
    ],
  },
  {
    eyebrow: "Safety",
    title: "Human-in-the-loop safety",
    body: "ForgePilot treats approvals as a first-class runtime primitive, especially before final artifacts, public claims, deployments, or outbound automation.",
    points: [
      "Risk levels are attached to timeline steps so high-impact actions stand out.",
      "Approval requests preserve what was requested, when, and who approved it.",
      "A run can pause without losing its timeline or artifact draft state.",
    ],
  },
  {
    eyebrow: "Artifacts",
    title: "Local-first artifact generation",
    body: "The output target is a local runtime artifact pack that builders can inspect, edit, commit, or submit.",
    points: [
      "Markdown and JSON outputs are represented as runtime artifact objects instead of disappearing in chat history.",
      "Run reports can be used as proof for demos, audits, and project handoff.",
      "The artifact writer is intentionally separate from the planner for clearer control.",
    ],
  },
  {
    eyebrow: "Bridge",
    title: "Webhook trigger bridge",
    body: "The inbound webhook route can accept manual tests, n8n payloads, or external trigger payloads while ForgePilot keeps planning, approval, and artifact writing local.",
    points: [
      "Webhook triggers map cleanly into the same Trigger Engine type used by manual commands.",
      "External automation can start runs without bypassing approval gates.",
      "The bridge returns run IDs and a Flight Recorder URL for downstream orchestration proof.",
    ],
  },
];

const proofChecklist = [
  "Qwen Cloud API adapter is implemented; credentialed production testing is planned",
  "Tool-calling adapter is implemented with local registry validation",
  "Human approval gate is implemented before final artifact generation",
  "Generated artifacts are implemented after approval",
  "Webhook trigger route and Trigger Lab are implemented",
  "Optional n8n live workflow remains planned",
  "Alibaba Cloud proof path remains planned",
  "Run report captures proof",
];

const buildStatus = [
  {
    label: "Already built",
    items: [
      "Premium command center and shell navigation",
      "Local runtime executor with Flight Recorder proof",
      "Typed run, tool, approval, and artifact data model",
      "Zod-validated local tool registry",
      "Normalized local API routes",
      "Runtime health check endpoint",
      "Qwen planner adapter with JSON validation and local fallback",
      "Qwen tool-call selection route with local registry validation",
      "App-owned tool execution through registered local tools",
      "Human approval gate before final artifact generation",
      "Flight Recorder proof trail with run reports",
      "Inbound webhook route for validated trigger payloads",
      "Trigger Lab UI for local webhook smoke tests",
      "Safe fallback modes for missing Qwen env vars",
      "Execution modes for local, Qwen plan, Qwen tools, and auto fallback",
      "Judge-facing architecture proof page",
      "Submission Proof Pack page",
    ],
  },
  {
    label: "Planned next",
    items: [
      "Optional live n8n workflow template connected to the webhook route",
      "Alibaba Cloud deployment proof",
      "Export and download improvements",
      "Demo video polish",
      "Persistent artifact storage beyond the in-memory MVP store",
    ],
  },
];

const qwenAdapterFacts = [
  "Reads Qwen env vars only on the server.",
  "Sends a safe tool manifest, not executable functions.",
  "Validates planner JSON and tool-call arguments before runtime execution.",
  "Records planner mode, execution mode, warnings, model name, and repair status.",
  "Blocks final artifact writing before approval.",
  "Falls back locally in auto mode when config or model output is unsafe.",
];

const runtimeControlBlocks = [
  {
    title: "App-owned execution",
    body: "ForgePilot owns every tool invocation. Qwen can plan or select, but only the local runtime dispatches registered tools.",
  },
  {
    title: "Qwen planner and selector",
    body: "Qwen adapters are server-side and env-driven. Auto mode falls back locally when Qwen credentials are absent or output is unsafe.",
  },
  {
    title: "Typed registry",
    body: "Tools have names, descriptions, Zod input schemas, risk levels, approval flags, and local execute functions.",
  },
  {
    title: "Approval gate",
    body: "Final artifact writing pauses at awaiting_approval and continues only after a recorded human decision.",
  },
  {
    title: "Webhook bridge",
    body: "The webhook route accepts validated manual, n8n, or external trigger payloads without bypassing approval.",
  },
  {
    title: "Artifact writer",
    body: "The MVP creates safe runtime artifact objects after approval instead of writing unreviewed files to disk.",
  },
  {
    title: "Flight Recorder",
    body: "Timeline, tool calls, approvals, artifacts, warnings, and reports stay inspectable after the run.",
  },
];

const mvpLimitations = [
  "Runs are stored in memory for the MVP and reset when the server process restarts.",
  "Artifacts are runtime objects, not durable exported files yet.",
  "Qwen credentials are not committed; credentialed verification must happen in the deployment environment.",
  "Alibaba Cloud deployment is a documented proof path, not claimed as complete.",
  "No real Gmail, LinkedIn, GitHub, posting, or deployment actions are implemented.",
];

export default function ArchitecturePage() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-black/25 p-6 shadow-2xl shadow-black/30 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/70">
          Judge Proof
        </p>
        <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          ForgePilot is an autopilot runtime foundation, not a dashboard skin.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-white/66">
          The local runtime now executes a real automation loop: trigger, deterministic
          planner or Qwen planner adapter, optional Qwen tool selection, typed local
          tool execution, approval, artifact generation, and a Flight Recorder
          timeline that preserves proof of what happened.
        </p>
      </section>

      <ArchitectureMap />

      <section className="rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/20 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/70">
              Runtime Control Model
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white">
              Intelligence is separate from authority
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/64">
              ForgePilot is designed so model output can guide the workflow without
              owning execution, approval, artifact writing, or the final proof trail.
            </p>
          </div>
          <span className="w-fit rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white/66">
            no production readiness overclaim
          </span>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {runtimeControlBlocks.map((block) => (
            <article key={block.title} className="rounded-lg border border-white/10 bg-black/25 p-4">
              <h3 className="text-base font-semibold text-white">{block.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/66">{block.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-cyan-200/18 bg-cyan-200/[0.05] p-5 shadow-2xl shadow-black/20 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/75">
              Qwen Runtime Adapter
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Qwen plans or selects. ForgePilot validates and executes.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/64">
              The adapter is intentionally narrow: it asks Qwen for structured planning
              output or a next-tool selection, validates the result against ForgePilot
              schemas, and lets the local runtime execute only registered tools.
            </p>
          </div>
          <span className="w-fit rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white/66">
            local execution boundary enforced
          </span>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {qwenAdapterFacts.map((fact) => (
            <div key={fact} className="rounded-lg border border-white/10 bg-black/25 p-3">
              <p className="text-sm leading-6 text-white/70">{fact}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-lg border border-teal-200/18 bg-teal-200/[0.055] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-100/75">
            Hackathon Proof Checklist
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            What judges can verify in this foundation
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {proofChecklist.map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-black/25 p-3">
                <p className="text-sm font-medium leading-6 text-white/72">{item}</p>
              </div>
            ))}
          </div>
        </article>

        <div className="grid gap-4 md:grid-cols-2">
          {buildStatus.map((group) => (
            <article key={group.label} className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/46">
                {group.label}
              </p>
              <div className="mt-5 space-y-3">
                {group.items.map((item) => (
                  <div key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-200" />
                    <p className="text-sm leading-6 text-white/68">{item}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {proofSections.map((section) => (
          <ProofSection key={section.title} {...section} />
        ))}
      </section>

      <section className="rounded-lg border border-amber-200/18 bg-amber-200/[0.055] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-100/75">
          MVP Limitations
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          What this foundation does not overclaim
        </h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {mvpLimitations.map((item) => (
            <div key={item} className="rounded-lg border border-white/10 bg-black/25 p-3">
              <p className="text-sm leading-6 text-white/70">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
