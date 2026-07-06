import { RuntimeError } from "@/lib/runtime/errors";
import { buildDeterministicPlan } from "@/lib/runtime/trigger-engine";
import { getPlannerToolManifest } from "@/lib/runtime/tool-registry";
import type {
  PlanStep,
  PlannerModeRequested,
  PlannerModeUsed,
} from "@/lib/runtime/types";

import { callQwenPlanner, getQwenConfigStatus, hasQwenConfig } from "./client";
import { normalizePlannerJson } from "./json-normalizer";
import {
  qwenPlannerResponseSchema,
  type QwenPlannerResponse,
} from "./types";

type PlannerResolution = {
  planSteps: PlanStep[];
  summary: string;
  plannerModeRequested: PlannerModeRequested;
  plannerModeUsed: PlannerModeUsed;
  qwenConfigured: boolean;
  qwenModel?: string;
  plannerWarnings: string[];
  qwenPlan?: QwenPlannerResponse;
};

const approvalToolName = "request_human_approval";
const artifactWriterToolName = "write_markdown_file";

function uniqueId(baseId: string, index: number, seenIds: Set<string>) {
  const normalized = baseId
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const fallback = `qwen-step-${index + 1}`;
  let candidate = normalized || fallback;
  let suffix = 2;

  while (seenIds.has(candidate)) {
    candidate = `${normalized || fallback}-${suffix}`;
    suffix += 1;
  }

  seenIds.add(candidate);
  return candidate;
}

function createLocalResolution(
  plannerModeRequested: PlannerModeRequested,
  plannerModeUsed: PlannerModeUsed,
  plannerWarnings: string[] = [],
): PlannerResolution {
  return {
    planSteps: buildDeterministicPlan(),
    summary:
      plannerModeUsed === "local_fallback"
        ? "ForgePilot selected the deterministic local planner as a safe fallback."
        : "ForgePilot selected the deterministic local planner.",
    plannerModeRequested,
    plannerModeUsed,
    qwenConfigured: hasQwenConfig(),
    plannerWarnings,
  };
}

function validatePlannerToolNames(plan: QwenPlannerResponse) {
  const manifest = getPlannerToolManifest();
  const allowedTools = new Set(manifest.map((tool) => tool.name));
  const unknownTools = plan.steps
    .map((step) => step.toolName)
    .filter((toolName) => !allowedTools.has(toolName));

  if (unknownTools.length > 0) {
    throw new Error(`Qwen selected unknown tools: ${unknownTools.join(", ")}`);
  }
}

function convertQwenPlanToPlanSteps(plan: QwenPlannerResponse) {
  const seenIds = new Set<string>(["plan-trigger", "plan-qwen", "plan-report"]);
  const warnings: string[] = [];
  const steps: PlanStep[] = [
    {
      id: "plan-trigger",
      title: "Trigger received",
      description: "Normalize the incoming goal and create a local runtime run record.",
      status: "completed",
      riskLevel: "low",
    },
    {
      id: "plan-qwen",
      title: "Generate Qwen planner output",
      description: plan.summary,
      status: "completed",
      toolName: "qwen.planner",
      riskLevel: "low",
    },
  ];

  for (const [index, step] of plan.steps.entries()) {
    steps.push({
      id: uniqueId(`plan-${step.id}`, index, seenIds),
      title: step.title,
      description: step.description,
      status: "pending",
      toolName: step.toolName,
      requiresApproval: step.requiresApproval,
      riskLevel: step.riskLevel,
    });
  }

  if (!steps.some((step) => step.toolName === approvalToolName)) {
    warnings.push("Qwen plan omitted the approval tool; ForgePilot inserted the approval gate.");
    steps.push({
      id: "plan-approval",
      title: "Request human approval",
      description: plan.approvalPolicy.reason,
      status: "pending",
      toolName: approvalToolName,
      requiresApproval: true,
      riskLevel: "medium",
    });
  }

  if (!steps.some((step) => step.toolName === artifactWriterToolName)) {
    warnings.push("Qwen plan omitted artifact writing; ForgePilot inserted the artifact writer after approval.");
    steps.push({
      id: "plan-write",
      title: "Write markdown artifact pack",
      description: "Create the approved local artifact pack after the approval gate.",
      status: "pending",
      toolName: artifactWriterToolName,
      requiresApproval: true,
      riskLevel: "medium",
    });
  }

  steps.push({
    id: "plan-report",
    title: "Complete run report",
    description: "Seal the run report with timeline, tools, approvals, and artifacts.",
    status: "pending",
    riskLevel: "low",
  });

  return {
    steps,
    warnings,
  };
}

export async function createPlannerResolution({
  goal,
  plannerMode,
}: {
  goal: string;
  plannerMode: PlannerModeRequested;
}): Promise<PlannerResolution> {
  const qwenConfig = getQwenConfigStatus();

  if (plannerMode === "local") {
    return createLocalResolution("local", "local");
  }

  if (!qwenConfig.configured) {
    if (plannerMode === "qwen") {
      throw new RuntimeError(
        "QWEN_NOT_CONFIGURED",
        "Qwen Cloud planner mode requires QWEN_API_KEY, QWEN_BASE_URL, and QWEN_MODEL.",
        400,
      );
    }

    return createLocalResolution("auto", "local_fallback", [
      "Qwen Cloud env vars are not configured, so auto mode used the local deterministic planner.",
    ]);
  }

  try {
    const plannerCall = await callQwenPlanner({
      goal,
      toolManifest: getPlannerToolManifest(),
    });
    const normalized = normalizePlannerJson(plannerCall.content);
    const plan = qwenPlannerResponseSchema.parse(normalized.value);

    validatePlannerToolNames(plan);

    const converted = convertQwenPlanToPlanSteps(plan);
    const plannerModeUsed: PlannerModeUsed = normalized.repaired
      ? "qwen_repaired"
      : "qwen";

    return {
      planSteps: converted.steps,
      summary: plan.summary,
      plannerModeRequested: plannerMode,
      plannerModeUsed,
      qwenConfigured: true,
      qwenModel: plannerCall.model,
      plannerWarnings: [...normalized.warnings, ...converted.warnings],
      qwenPlan: plan,
    };
  } catch (error) {
    return createLocalResolution(plannerMode, "local_fallback", [
      error instanceof Error
        ? `Qwen planner fallback: ${error.message}`
        : "Qwen planner fallback: unexpected planner error.",
    ]);
  }
}
