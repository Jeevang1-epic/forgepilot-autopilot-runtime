import { emptyInputSchema } from "@/lib/validation/schemas";
import type { ToolDefinition } from "@/lib/runtime/types";

const checklistItems = [
  "Repo link",
  "Public demo/deployment",
  "Qwen Cloud usage proof",
  "Architecture diagram",
  "Demo video under 3 minutes",
  "Text description",
  "Alibaba Cloud proof path",
  "README",
  "Generated artifacts",
];

export const generateSubmissionChecklistTool: ToolDefinition = {
  name: "generate_submission_checklist",
  description: "Creates a hackathon readiness checklist for the submission pack.",
  inputSchema: emptyInputSchema,
  riskLevel: "low",
  requiresApproval: false,
  execute: () => ({
    summary: "Submission checklist generated with hackathon proof requirements.",
    data: {
      title: "Qwen Cloud Hackathon Submission Checklist",
      items: checklistItems.map((label) => ({
        label,
        status: label === "Qwen Cloud usage proof" ? "planned" : "ready-to-review",
      })),
    },
  }),
};
