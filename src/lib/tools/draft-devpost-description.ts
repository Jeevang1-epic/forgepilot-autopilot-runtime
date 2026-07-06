import { emptyInputSchema } from "@/lib/validation/schemas";
import type { ToolDefinition } from "@/lib/runtime/types";

const devpostDescription = `ForgePilot is a local-first autopilot runtime for solo builders preparing complex project workflows under time pressure.

The problem is simple: builders do not need another chat window that suggests work. They need a reliable runtime that can turn one messy command into an auditable sequence of planned steps, typed tool calls, approval checkpoints, generated artifacts, and a Flight Recorder timeline.

ForgePilot currently demonstrates that foundation with a deterministic local planner and tool registry. It can create a hackathon submission workflow, scan project status, generate a checklist, draft a Devpost description, prepare a demo script, draft a launch post, summarize architecture, pause for human approval, and then generate local artifact objects plus a run report.

This is not a chatbot because the core unit is a run, not a conversation. Each run has status, plan steps, tool call records, approval requests, artifacts, timestamps, and a report that can be inspected after execution.

The architecture is Trigger Engine -> Planner -> Runtime Executor -> Tool Registry -> Approval Gate -> Artifact Writer -> Flight Recorder.

The next phase is Qwen Cloud integration. Qwen will replace the deterministic local planner by producing structured plans and tool intents, while ForgePilot keeps local execution, approval gates, artifact generation, and proof recording under operator control.`;

export const draftDevpostDescriptionTool: ToolDefinition = {
  name: "draft_devpost_description",
  description: "Drafts honest Devpost copy without claiming live Qwen integration.",
  inputSchema: emptyInputSchema,
  riskLevel: "medium",
  requiresApproval: false,
  execute: () => ({
    summary: "Devpost description drafted with problem, solution, architecture, and planned Qwen integration.",
    data: {
      fileName: "devpost-description.md",
      content: devpostDescription,
    },
  }),
};
