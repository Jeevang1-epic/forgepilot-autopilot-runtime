import { z } from "zod";

export const qwenPlannerStepSchema = z
  .object({
    id: z.string().trim().min(1),
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    toolName: z.string().trim().min(1),
    riskLevel: z.enum(["low", "medium", "high"]),
    requiresApproval: z.boolean(),
  })
  .strict();

export const qwenPlannerResponseSchema = z
  .object({
    goal: z.string().trim().min(1),
    summary: z.string().trim().min(1),
    steps: z.array(qwenPlannerStepSchema).min(1),
    approvalPolicy: z
      .object({
        requiredBeforeFinalArtifacts: z.boolean(),
        reason: z.string().trim().min(1),
      })
      .strict(),
  })
  .strict();

export type QwenPlannerStep = z.infer<typeof qwenPlannerStepSchema>;
export type QwenPlannerResponse = z.infer<typeof qwenPlannerResponseSchema>;

export type QwenConfigStatus = {
  hasApiKey: boolean;
  hasBaseUrl: boolean;
  hasModel: boolean;
  configured: boolean;
  modelName?: string;
};

export type QwenPlannerCallInput = {
  goal: string;
  toolManifest: PlannerToolManifestItem[];
};

export type QwenPlannerCallResult = {
  content: string;
  model: string;
};

export type PlannerToolManifestItem = {
  name: string;
  description: string;
  riskLevel: "low" | "medium" | "high";
  requiresApproval: boolean;
  inputDescription: string;
};
