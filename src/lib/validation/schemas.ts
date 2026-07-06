import { z } from "zod";

export const triggerTypeSchema = z.enum(["manual", "webhook", "scheduled_demo"]);

export const createRunSchema = z.object({
  goal: z.string().trim().min(8, "Goal must describe the intended workflow."),
  triggerType: triggerTypeSchema.default("manual"),
});

export const approvalDecisionSchema = z.object({
  approvalId: z.string().trim().min(1, "approvalId is required."),
  decision: z.enum(["approved", "rejected"]),
});

export const emptyInputSchema = z.object({}).default({});

export const markdownFileInputSchema = z.object({
  files: z.array(
    z.object({
      fileName: z.string().trim().min(1),
      kind: z.enum(["markdown", "json", "script", "summary", "checklist"]),
      description: z.string().trim().min(1),
      content: z.string().min(1),
    }),
  ),
});

export type CreateRunSchemaInput = z.infer<typeof createRunSchema>;
export type ApprovalDecisionSchemaInput = z.infer<typeof approvalDecisionSchema>;
export type MarkdownFileInput = z.infer<typeof markdownFileInputSchema>;
