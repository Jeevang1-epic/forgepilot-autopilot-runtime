import { createRunSchema } from "@/lib/validation/schemas";

import {
  buildArtifactWriteInput,
  parseArtifacts,
  refreshRunReportArtifact,
} from "./artifact-writer";
import {
  approvePendingApproval,
  getPendingApproval,
  parseApprovalRequest,
} from "./approval-gate";
import { RuntimeError } from "./errors";
import {
  buildRunReport,
  recordTimelineStep,
  recordToolCall,
} from "./flight-recorder";
import { getRun, saveRun } from "./run-store";
import { executeRegisteredTool } from "./tool-registry";
import { createRunRecord, demoGoal } from "./trigger-engine";
import type {
  ApprovalDecisionInput,
  CreateRunInput,
  ForgePilotRun,
  ToolCall,
} from "./types";

const preApprovalToolNames = [
  "scan_project_status",
  "generate_submission_checklist",
  "draft_devpost_description",
  "generate_demo_script",
  "draft_linkedin_post",
  "generate_architecture_summary",
] as const;

function markPlanStep(
  run: ForgePilotRun,
  toolName: string,
  status: "running" | "completed" | "awaiting_approval" | "pending",
) {
  const planStep = run.planSteps.find((step) => step.toolName === toolName);

  if (planStep) {
    planStep.status = status;
  }
}

function summarizeInput(input: unknown) {
  if (!input || (typeof input === "object" && Object.keys(input).length === 0)) {
    return "No input required.";
  }

  return JSON.stringify(input);
}

async function executeToolForRun(run: ForgePilotRun, toolName: string, input: unknown) {
  const startedAt = new Date().toISOString();
  markPlanStep(run, toolName, "running");

  try {
    const { tool, parsedInput, result } = await executeRegisteredTool(toolName, input, {
      runId: run.id,
      goal: run.goal,
      now: startedAt,
    });

    const completedAt = new Date().toISOString();
    const toolCall: ToolCall = {
      id: `tool-${crypto.randomUUID()}`,
      name: tool.name,
      provider: tool.name === "write_markdown_file" ? "runtime" : "local",
      status: "completed",
      riskLevel: tool.riskLevel,
      inputSummary: summarizeInput(parsedInput),
      input: parsedInput,
      outputSummary: result.summary,
      output: result.data,
      startedAt,
      completedAt,
    };

    recordToolCall(run, toolCall);
    markPlanStep(run, toolName, "completed");
    recordTimelineStep(run, {
      title: tool.description,
      description: result.summary,
      toolName: tool.name,
      toolCallId: toolCall.id,
      riskLevel: tool.riskLevel,
    });

    return result;
  } catch (error) {
    const failedAt = new Date().toISOString();
    const toolCall: ToolCall = {
      id: `tool-${crypto.randomUUID()}`,
      name: toolName,
      provider: toolName === "write_markdown_file" ? "runtime" : "local",
      status: "failed",
      riskLevel: "medium",
      inputSummary: summarizeInput(input),
      input,
      outputSummary:
        error instanceof Error ? error.message : "Tool execution failed.",
      startedAt,
      completedAt: failedAt,
    };

    recordToolCall(run, toolCall);
    markPlanStep(run, toolName, "pending");
    recordTimelineStep(run, {
      title: "Tool execution failed",
      description: toolCall.outputSummary ?? "Tool execution failed.",
      status: "blocked",
      toolName,
      toolCallId: toolCall.id,
      riskLevel: toolCall.riskLevel,
    });

    throw new RuntimeError(
      "TOOL_EXECUTION_FAILED",
      toolCall.outputSummary ?? "Tool execution failed.",
      400,
    );
  }
}

export function createAutopilotRun(input: CreateRunInput) {
  const parsedInput = createRunSchema.parse(input);
  const run = createRunRecord(parsedInput);

  recordTimelineStep(run, {
    title: "Trigger received",
    description: "Local trigger engine accepted the goal and created a run record.",
    toolName: "trigger.engine",
    riskLevel: "low",
  });

  return saveRun(run);
}

export function createDemoAutopilotRun() {
  return createAutopilotRun({
    goal: demoGoal,
    triggerType: "manual",
  });
}

export async function executeAutopilotRun(runId: string) {
  const run = getRun(runId);

  if (!run) {
    throw new RuntimeError("RUN_NOT_FOUND", "Run not found.", 404);
  }

  if (
    run.status === "awaiting_approval" ||
    run.status === "completed" ||
    run.status === "failed"
  ) {
    return run;
  }

  run.status = "planning";
  run.summary = "Building deterministic local plan.";
  recordTimelineStep(run, {
    title: "Build deterministic local plan",
    description: "Runtime created a local plan that Qwen Cloud will control in the next phase.",
    toolName: "local.planner",
    riskLevel: "low",
  });

  run.status = "running";
  run.summary = "Executing local typed tools.";

  try {
    for (const toolName of preApprovalToolNames) {
      await executeToolForRun(run, toolName, {});
    }

    const approvalResult = await executeToolForRun(run, "request_human_approval", {});
    const approval = parseApprovalRequest(approvalResult.data);
    run.approvalRequests.push(approval);
    run.status = "awaiting_approval";
    run.summary = "Runtime paused at the approval gate before final artifact generation.";
    markPlanStep(run, "request_human_approval", "awaiting_approval");
    recordTimelineStep(run, {
      title: "Human approval requested",
      description: approval.reason ?? approval.summary,
      status: "approval_required",
      toolName: "approval.gate",
      riskLevel: approval.riskLevel,
    });

    return saveRun(run);
  } catch (error) {
    run.status = "failed";
    run.error = error instanceof Error ? error.message : "Runtime execution failed.";
    run.completedAt = new Date().toISOString();
    run.summary = "Run failed during local tool execution.";
    run.report = buildRunReport(run);
    return saveRun(run);
  }
}

export async function continueRunAfterApproval(runId: string) {
  const run = getRun(runId);

  if (!run) {
    throw new RuntimeError("RUN_NOT_FOUND", "Run not found.", 404);
  }

  const pendingApproval = getPendingApproval(run);

  if (pendingApproval) {
    throw new RuntimeError(
      "RUN_NOT_APPROVABLE",
      "Run still requires approval.",
      400,
    );
  }

  if (run.status === "completed") {
    return run;
  }

  if (run.status === "failed") {
    return run;
  }

  if (run.artifacts.length > 0) {
    run.status = "completed";
    run.completedAt = run.completedAt ?? new Date().toISOString();
    run.finalSummary =
      run.finalSummary ??
      "Local autopilot run completed with artifacts already present.";
    run.summary = run.finalSummary;
    run.report = buildRunReport(run);
    refreshRunReportArtifact(run);
    return saveRun(run);
  }

  run.status = "running";
  run.summary = "Approval granted. Creating final artifact pack.";

  const artifactInput = buildArtifactWriteInput(run);
  const artifactResult = await executeToolForRun(run, "write_markdown_file", artifactInput);
  const artifacts = parseArtifacts(artifactResult.data);
  run.artifacts = artifacts;

  recordTimelineStep(run, {
    title: "Artifact pack written",
    description: "Final generated artifacts were created as local runtime objects.",
    toolName: "artifact.writer",
    riskLevel: "medium",
  });

  const reportStep = run.planSteps.find((step) => step.id === "plan-report");

  if (reportStep) {
    reportStep.status = "completed";
  }

  run.status = "completed";
  run.completedAt = new Date().toISOString();
  run.finalSummary =
    "Local autopilot run completed with tool calls, approval record, artifacts, and report.";
  run.summary = run.finalSummary;

  recordTimelineStep(run, {
    title: "Run report completed",
    description: "Flight Recorder sealed the completed run report.",
    toolName: "flight.recorder",
    riskLevel: "low",
  });

  run.report = buildRunReport(run);
  refreshRunReportArtifact(run);

  return saveRun(run);
}

export async function approveRunAction(input: ApprovalDecisionInput) {
  const run = approvePendingApproval(input);

  if (input.decision === "rejected" || run.status === "failed") {
    return run;
  }

  return continueRunAfterApproval(run.id);
}

export async function rejectRunAction(input: ApprovalDecisionInput) {
  return approveRunAction({
    ...input,
    decision: "rejected",
  });
}

export function sealFailedRun(runId: string, error: string) {
  const run = getRun(runId);

  if (!run) {
    return undefined;
  }

  run.status = "failed";
  run.error = error;
  run.completedAt = new Date().toISOString();
  run.summary = "Run stopped before completion.";
  run.report = buildRunReport(run);

  recordTimelineStep(run, {
    title: "Run stopped",
    description: error,
    status: "blocked",
    toolName: "runtime.executor",
    riskLevel: "medium",
  });

  return saveRun(run);
}
