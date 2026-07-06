import { emptyInputSchema } from "@/lib/validation/schemas";
import type { ApprovalRequest, ToolDefinition } from "@/lib/runtime/types";

export const requestHumanApprovalTool: ToolDefinition = {
  name: "request_human_approval",
  description: "Creates a pending approval request before final artifact generation.",
  inputSchema: emptyInputSchema,
  riskLevel: "medium",
  requiresApproval: false,
  execute: (_input, context) => {
    const approval: ApprovalRequest = {
      id: `approval-${crypto.randomUUID()}`,
      runId: context.runId,
      title: "Finalize and write submission artifact pack",
      summary: "Review generated drafts before ForgePilot creates final artifact objects.",
      reason: "This writes final generated artifacts and marks the run as completed.",
      status: "requested",
      riskLevel: "medium",
      requestedAt: context.now,
    };

    return {
      summary: "Human approval requested before final artifact generation.",
      data: approval,
    };
  },
};
