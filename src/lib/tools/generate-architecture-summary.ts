import { emptyInputSchema } from "@/lib/validation/schemas";
import type { ToolDefinition } from "@/lib/runtime/types";

const architectureSummary = `# ForgePilot Architecture Summary

Runtime flow:
Trigger Engine -> Planner -> Runtime Executor -> Tool Registry -> Approval Gate -> Artifact Writer -> Flight Recorder

ForgePilot starts with a trigger, currently a manual command or demo API call. The local planner creates a deterministic set of run steps. The Runtime Executor dispatches typed tools through the Tool Registry, records every tool call, and pauses at the Approval Gate before high-impact artifact finalization.

The Artifact Writer currently simulates safe writes by creating artifact objects in runtime state instead of relying on server filesystem persistence. The Flight Recorder preserves timeline steps, tool call inputs and outputs, approval state, artifacts, and the final report.

Qwen Cloud integration is planned for the next phase. Qwen will produce structured plans and tool intents, while ForgePilot remains responsible for local execution, approval, artifacts, and proof.`;

export const generateArchitectureSummaryTool: ToolDefinition = {
  name: "generate_architecture_summary",
  description: "Generates concise architecture content for the submission pack.",
  inputSchema: emptyInputSchema,
  riskLevel: "low",
  requiresApproval: false,
  execute: () => ({
    summary: "Architecture summary generated for the local runtime flow.",
    data: {
      fileName: "architecture-summary.md",
      content: architectureSummary,
    },
  }),
};
