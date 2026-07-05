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
    title: "Qwen Cloud integration plan",
    body: "The current MVP uses seeded planner data. The planned integration will call Qwen Cloud to produce structured plans, risk labels, and tool intents.",
    points: [
      "Use Qwen for plan generation from messy solo-builder commands.",
      "Return JSON plan steps that match ForgePilot timeline and tool-call types.",
      "Keep prompts and planner configuration explicit so the behavior can be reviewed.",
    ],
  },
  {
    eyebrow: "Execution",
    title: "Tool-calling runtime plan",
    body: "The runtime layer will only dispatch tools registered with schemas, allowed effects, and output contracts.",
    points: [
      "Tool calls will be validated before execution and recorded after completion.",
      "Local tools will handle scanning, writing, checklist generation, and report assembly.",
      "Hosted or external tools can be added behind explicit registry entries later.",
    ],
  },
  {
    eyebrow: "Safety",
    title: "Human-in-the-loop safety",
    body: "ForgePilot treats approvals as a first-class runtime primitive, especially before public claims, file writes, deployments, or outbound automation.",
    points: [
      "Risk levels are attached to timeline steps so high-impact actions stand out.",
      "Approval requests preserve what was requested, when, and who approved it.",
      "A run can pause without losing its timeline or artifact draft state.",
    ],
  },
  {
    eyebrow: "Artifacts",
    title: "Local-first artifact generation",
    body: "The output target is a local artifact pack that builders can inspect, edit, commit, or submit.",
    points: [
      "Markdown and JSON outputs stay in the workspace rather than disappearing in chat history.",
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
        <p className="mt-5 max-w-3xl text-base leading-7 text-white/60">
          The architecture is built around a real automation loop: trigger, planner,
          tool execution, approval, artifact writing, and a Flight Recorder timeline
          that preserves proof of what happened.
        </p>
      </section>

      <ArchitectureMap />

      <section className="grid gap-4 lg:grid-cols-2">
        {proofSections.map((section) => (
          <ProofSection key={section.title} {...section} />
        ))}
      </section>
    </div>
  );
}
