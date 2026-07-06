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
    title: "Qwen Cloud planner adapter",
    body: "The runtime now has a Qwen planner adapter that can request structured plans when env vars are configured, then validate or safely fall back before execution.",
    points: [
      "Qwen is used for plan generation only; ForgePilot still owns execution.",
      "Planner responses are validated as JSON with known tools, risk labels, and approval policy.",
      "Auto mode falls back to the deterministic local planner if Qwen is not configured or output is invalid.",
    ],
  },
  {
    eyebrow: "Execution",
    title: "Tool-calling runtime",
    body: "The runtime layer dispatches local tools registered with schemas, allowed effects, risk levels, and output contracts. Full Qwen function-call execution is planned next.",
    points: [
      "Tool calls are validated before execution and recorded after completion.",
      "Local tools handle scanning, writing, checklist generation, and report assembly.",
      "Qwen never receives executable functions, only a safe tool manifest.",
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
    title: "Future n8n webhook bridge",
    body: "A future bridge can let n8n trigger ForgePilot runs while ForgePilot keeps planning, approval, and artifact writing local.",
    points: [
      "Webhook triggers map cleanly into the same Trigger Engine type used by manual commands.",
      "External automation can start runs without bypassing approval gates.",
      "The bridge can return run IDs and report paths for downstream orchestration.",
    ],
  },
];

const proofChecklist = [
  "Qwen Cloud planner adapter added",
  "Qwen function-call execution loop planned",
  "Typed tool calling implemented locally",
  "Human approval gate implemented locally",
  "Generated runtime artifacts implemented",
  "Runtime API routes implemented",
  "Webhook trigger planned",
  "Alibaba Cloud proof path planned",
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
      "Judge-facing architecture proof page",
    ],
  },
  {
    label: "Planned next",
    items: [
      "Qwen function-call execution loop",
      "Persistent artifact storage beyond the in-memory MVP store",
      "Authenticated approval decisions for shared deployments",
      "Webhook bridge for external trigger intake",
      "Alibaba Cloud proof path",
    ],
  },
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
          planner or Qwen planner adapter, typed tool execution, approval, artifact
          generation, and a Flight Recorder timeline that preserves proof of what
          happened.
        </p>
      </section>

      <ArchitectureMap />

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
    </div>
  );
}
