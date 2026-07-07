import { z } from "zod";

export const triggerTypeSchema = z.enum(["manual", "webhook", "scheduled_demo"]);

export const plannerModeSchema = z.enum(["local", "qwen", "auto"]);

export const executionModeSchema = z.enum([
  "local",
  "qwen_plan",
  "qwen_tools",
  "auto",
]);

export const createRunSchema = z.object({
  goal: z.string().trim().min(8, "Goal must describe the intended workflow."),
  triggerType: triggerTypeSchema.default("manual"),
  plannerMode: plannerModeSchema.default("auto"),
  executionMode: executionModeSchema.default("auto"),
});

export const plannerRequestSchema = z.object({
  goal: z.string().trim().min(8, "Goal must describe the intended workflow."),
  plannerMode: plannerModeSchema.default("auto"),
});

export const qwenToolCallRequestSchema = z.object({
  goal: z.string().trim().min(8, "Goal must describe the intended workflow."),
  context: z.record(z.string(), z.unknown()).default({}),
  executionMode: executionModeSchema.default("qwen_tools"),
});

export const demoRunRequestSchema = z.object({
  goal: z
    .string()
    .trim()
    .min(8, "Goal must describe the intended workflow.")
    .optional(),
  plannerMode: plannerModeSchema.default("auto"),
  executionMode: executionModeSchema.default("auto"),
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
export type PlannerRequestSchemaInput = z.infer<typeof plannerRequestSchema>;
export type DemoRunRequestSchemaInput = z.infer<typeof demoRunRequestSchema>;
export type QwenToolCallRequestSchemaInput = z.infer<
  typeof qwenToolCallRequestSchema
>;
export type ApprovalDecisionSchemaInput = z.infer<typeof approvalDecisionSchema>;
export type MarkdownFileInput = z.infer<typeof markdownFileInputSchema>;
