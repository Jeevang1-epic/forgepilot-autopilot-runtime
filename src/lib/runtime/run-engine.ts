import { createRunSchema } from "@/lib/validation/schemas";
import { getQwenConfigStatus } from "@/lib/qwen/client";
import { createPlannerResolution } from "@/lib/qwen/planner";
import { callQwenForNextTool } from "@/lib/qwen/tool-calling";
import { getOpenAICompatibleToolDefinitions } from "@/lib/qwen/tool-manifest";

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
import { executeRegisteredTool, getToolDefinition } from "./tool-registry";
import { createRunRecord, demoGoal } from "./trigger-engine";
import type {
  ApprovalDecisionInput,
  CreateRunInput,
  ForgePilotRun,
  ToolSelectionSource,
  ToolCall,
  ToolValidationStatus,
} from "./types";

const approvalToolName = "request_human_approval";
const artifactWriterToolName = "write_markdown_file";
export const maxQwenToolSteps = 8;
const requiredPreApprovalToolNames = [
  "scan_project_status",
  "generate_submission_checklist",
  "draft_devpost_description",
  "generate_demo_script",
  "draft_linkedin_post",
  "generate_architecture_summary",
];

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

type ToolRunOptions = {
  selectedBy?: ToolSelectionSource;
  validationStatus?: ToolValidationStatus;
};

async function executeToolForRun(
  run: ForgePilotRun,
  toolName: string,
  input: unknown,
  options: ToolRunOptions = {},
) {
  const startedAt = new Date().toISOString();
  const registeredTool = getToolDefinition(toolName);
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
      requiresApproval: tool.requiresApproval,
      selectedBy: options.selectedBy ?? "runtime",
      validationStatus: options.validationStatus ?? "passed",
      executionOwner: "forgepilot-runtime",
    };

    recordToolCall(run, toolCall);
    markPlanStep(run, toolName, "completed");
    recordTimelineStep(run, {
      title:
        toolCall.selectedBy === "qwen"
          ? `Selected by Qwen: ${tool.description}`
          : tool.description,
      description:
        toolCall.selectedBy === "qwen"
          ? `Validation passed. ForgePilot executed the local tool. ${result.summary}`
          : result.summary,
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
      requiresApproval: registeredTool?.requiresApproval ?? false,
      selectedBy: options.selectedBy ?? "runtime",
      validationStatus: "failed",
      executionOwner: "forgepilot-runtime",
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
  const qwenConfig = getQwenConfigStatus();

  run.qwenConfigured = qwenConfig.configured;
  run.toolManifestCount = getOpenAICompatibleToolDefinitions().length;
  run.qwenToolCallingAvailable = qwenConfig.configured && run.toolManifestCount > 0;

  recordTimelineStep(run, {
    title: "Trigger received",
    description: "Local trigger engine accepted the goal and created a run record.",
    toolName: "trigger.engine",
    riskLevel: "low",
  });

  return saveRun(run);
}

export function createDemoAutopilotRun(input?: Partial<CreateRunInput>) {
  return createAutopilotRun({
    goal: input?.goal ?? demoGoal,
    triggerType: input?.triggerType ?? "manual",
    plannerMode: input?.plannerMode ?? "auto",
    executionMode: input?.executionMode ?? "auto",
  });
}

function getPreApprovalToolNames(run: ForgePilotRun) {
  const seen = new Set<string>();
  const toolNames: string[] = [];

  for (const step of run.planSteps) {
    if (
      !step.toolName ||
      step.toolName === approvalToolName ||
      step.toolName === artifactWriterToolName
    ) {
      continue;
    }

    const tool = getToolDefinition(step.toolName);

    if (!tool || tool.requiresApproval || seen.has(tool.name)) {
      continue;
    }

    seen.add(tool.name);
    toolNames.push(tool.name);
  }

  return toolNames;
}

function getCompletedToolNames(run: ForgePilotRun) {
  return new Set(
    run.toolCalls
      .filter((toolCall) => toolCall.status === "completed")
      .map((toolCall) => toolCall.name),
  );
}

function getMissingRequiredTools(run: ForgePilotRun) {
  const completedTools = getCompletedToolNames(run);

  return requiredPreApprovalToolNames.filter(
    (toolName) => !completedTools.has(toolName),
  );
}

function buildQwenToolContext(run: ForgePilotRun) {
  return {
    runId: run.id,
    status: run.status,
    plannerModeUsed: run.plannerModeUsed,
    executionModeRequested: run.executionModeRequested,
    completedTools: [...getCompletedToolNames(run)],
    selectedToolsCount: run.selectedToolsCount,
    locallyCompletedToolsCount: run.locallyCompletedToolsCount,
    maxToolLoopHit: run.maxToolLoopHit,
    warnings: run.qwenToolCallWarnings,
    lastToolOutputs: run.toolCalls.slice(-3).map((toolCall) => ({
      name: toolCall.name,
      status: toolCall.status,
      outputSummary: toolCall.outputSummary,
    })),
  };
}

function recordUnsafeToolBlock(run: ForgePilotRun, toolName: string) {
  const warning = `Qwen selected ${toolName} before approval; ForgePilot blocked it and requested human approval.`;
  run.qwenToolCallWarnings.push(warning);
  run.blockedUnsafeToolCalls.push({
    toolName,
    reason: "Qwen selected a final artifact writer before human approval.",
    safetyRule: "Final artifact writing requires an approved human checkpoint.",
    fallbackAction: "Request human approval before any artifact writer runs.",
    blockedAt: new Date().toISOString(),
    riskLevel: "high",
  });
  run.blockedUnsafeToolCallsCount = run.blockedUnsafeToolCalls.length;
  recordTimelineStep(run, {
    title: "Unsafe Qwen tool call blocked",
    description: warning,
    status: "blocked",
    toolName,
    riskLevel: "high",
  });
}

function hasApprovedArtifactGate(run: ForgePilotRun) {
  return run.approvalRequests.some((request) => request.status === "approved");
}

async function requestApprovalAndPause(
  run: ForgePilotRun,
  selectedBy: ToolSelectionSource = "runtime",
) {
  const approvalResult = await executeToolForRun(
    run,
    approvalToolName,
    {},
    {
      selectedBy,
      validationStatus: "passed",
    },
  );
  const approval = parseApprovalRequest(approvalResult.data);
  run.approvalRequests.push(approval);
  run.status = "awaiting_approval";
  run.summary = "Runtime paused at the approval gate before final artifact generation.";
  markPlanStep(run, approvalToolName, "awaiting_approval");
  recordTimelineStep(run, {
    title: "Human approval requested",
    description: approval.reason ?? approval.summary,
    status: "approval_required",
    toolName: "approval.gate",
    riskLevel: approval.riskLevel,
  });

  return saveRun(run);
}

async function completeMissingRequiredToolsLocally(run: ForgePilotRun) {
  const missingTools = getMissingRequiredTools(run);

  if (missingTools.length > 0 && run.qwenToolCallingUsed) {
    run.executionModeUsed = "qwen_tools_with_local_completion";
    run.locallyCompletedToolsCount += missingTools.length;
    run.qwenToolCallWarnings.push(
      `ForgePilot completed missing required tools locally: ${missingTools.join(", ")}.`,
    );
  }

  for (const toolName of missingTools) {
    await executeToolForRun(run, toolName, {}, {
      selectedBy: run.qwenToolCallingUsed ? "local_completion" : "runtime",
      validationStatus: "passed",
    });
  }
}

async function executeQwenGuidedPreApprovalTools(run: ForgePilotRun) {
  let loopCount = 0;

  for (let step = 0; step < maxQwenToolSteps; step += 1) {
    loopCount = step + 1;
    const qwenResult = await callQwenForNextTool({
      goal: run.goal,
      context: buildQwenToolContext(run),
      completedTools: [...getCompletedToolNames(run)],
      requiredTools: [...requiredPreApprovalToolNames, approvalToolName],
      executionMode: run.executionModeRequested,
    });

    run.qwenConfigured = qwenResult.qwenConfigured;
    run.qwenToolCallingAvailable = qwenResult.qwenToolCallingAvailable;
    run.qwenModel = qwenResult.qwenModel ?? run.qwenModel;
    run.qwenToolCallWarnings.push(...qwenResult.warnings);

    if (!qwenResult.ok || !qwenResult.selectedToolCall) {
      break;
    }

    run.qwenToolCallingUsed = true;
    run.selectedToolsCount += 1;
    const selectedTool = qwenResult.selectedToolCall;

    recordTimelineStep(run, {
      title: "Qwen selected next tool",
      description: `${selectedTool.name} selected. ${qwenResult.validation.reason}`,
      toolName: selectedTool.name,
      riskLevel: selectedTool.riskLevel,
    });

    if (selectedTool.name === artifactWriterToolName) {
      recordUnsafeToolBlock(run, artifactWriterToolName);
      return requestApprovalAndPause(run, "runtime");
    }

    if (selectedTool.name === approvalToolName) {
      return requestApprovalAndPause(run, "qwen");
    }

    if (getCompletedToolNames(run).has(selectedTool.name)) {
      run.qwenToolCallWarnings.push(
        `Qwen selected already-completed tool ${selectedTool.name}; ForgePilot skipped the duplicate.`,
      );
      continue;
    }

    await executeToolForRun(run, selectedTool.name, selectedTool.parsedArguments, {
      selectedBy: "qwen",
      validationStatus: "passed",
    });

    if (getMissingRequiredTools(run).length === 0) {
      break;
    }
  }

  if (loopCount >= maxQwenToolSteps && getMissingRequiredTools(run).length > 0) {
    run.maxToolLoopHit = true;
    run.qwenToolCallWarnings.push(
      `Qwen tool selection reached the ${maxQwenToolSteps}-step safety limit; ForgePilot completed missing tools locally.`,
    );
    recordTimelineStep(run, {
      title: "Qwen tool loop limit reached",
      description:
        "ForgePilot stopped asking Qwen for tool selections and continued with local completion.",
      status: "blocked",
      toolName: "runtime.executor",
      riskLevel: "medium",
    });
  }

  await completeMissingRequiredToolsLocally(run);

  return undefined;
}

function resolveLocalExecutionMode(run: ForgePilotRun) {
  if (run.executionModeRequested === "local") {
    return "local";
  }

  if (run.executionModeRequested === "qwen_plan") {
    return run.plannerModeUsed === "qwen" || run.plannerModeUsed === "qwen_repaired"
      ? "qwen_plan"
      : "local_fallback";
  }

  return "local_fallback";
}

function plannerTimelineTitle(run: ForgePilotRun) {
  if (run.plannerModeUsed === "qwen") {
    return "Qwen plan generated";
  }

  if (run.plannerModeUsed === "qwen_repaired") {
    return "Qwen plan repaired and validated";
  }

  if (run.plannerModeUsed === "local_fallback") {
    return "Local fallback plan selected";
  }

  return "Local deterministic plan selected";
}

function plannerToolName(run: ForgePilotRun) {
  return run.plannerModeUsed === "qwen" || run.plannerModeUsed === "qwen_repaired"
    ? "qwen.planner"
    : "local.planner";
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

  try {
    const planner = await createPlannerResolution({
      goal: run.goal,
      plannerMode: run.plannerModeRequested,
    });

    run.planSteps = planner.planSteps;
    run.summary = planner.summary;
    run.plannerModeRequested = planner.plannerModeRequested;
    run.plannerModeUsed = planner.plannerModeUsed;
    run.qwenConfigured = planner.qwenConfigured;
    run.qwenModel = planner.qwenModel;
    run.qwenJsonRepairUsed = planner.qwenJsonRepairUsed;
    run.plannerWarnings = planner.plannerWarnings;

    recordTimelineStep(run, {
      title: plannerTimelineTitle(run),
      description:
        planner.plannerWarnings.length > 0
          ? `${planner.summary} ${planner.plannerWarnings.join(" ")}`
          : planner.summary,
      toolName: plannerToolName(run),
      riskLevel: run.plannerModeUsed === "local_fallback" ? "medium" : "low",
    });

    run.status = "running";
    run.summary = "Executing typed tools from the validated planner output.";
    const qwenConfig = getQwenConfigStatus();
    run.toolManifestCount = getOpenAICompatibleToolDefinitions().length;
    run.qwenToolCallingAvailable = qwenConfig.configured && run.toolManifestCount > 0;
    const shouldUseQwenTools =
      run.executionModeRequested === "qwen_tools" ||
      (run.executionModeRequested === "auto" && qwenConfig.configured);

    if (shouldUseQwenTools && qwenConfig.configured) {
      run.executionModeUsed = "qwen_tools";

      try {
        const pausedRun = await executeQwenGuidedPreApprovalTools(run);

        if (pausedRun) {
          return pausedRun;
        }
      } catch (error) {
        run.qwenToolCallWarnings.push(
          error instanceof Error
            ? `Qwen tool calling fell back to local execution: ${error.message}`
            : "Qwen tool calling fell back to local execution.",
        );
        run.executionModeUsed = run.qwenToolCallingUsed
          ? "qwen_tools_with_local_completion"
          : "local_fallback";
        await completeMissingRequiredToolsLocally(run);
      }
    } else {
      run.executionModeUsed = resolveLocalExecutionMode(run);

      if (
        (run.executionModeRequested === "auto" ||
          run.executionModeRequested === "qwen_tools") &&
        !qwenConfig.configured
      ) {
        run.qwenToolCallWarnings.push(
          "Qwen Tool Calling unavailable - ForgePilot continued with local fallback.",
        );
      }

      for (const toolName of getPreApprovalToolNames(run)) {
        await executeToolForRun(run, toolName, {});
      }
    }

    return requestApprovalAndPause(run);
  } catch (error) {
    run.status = "failed";
    run.error = error instanceof Error ? error.message : "Runtime execution failed.";
    run.completedAt = new Date().toISOString();
    run.summary =
      run.timeline.length <= 1
        ? "Run failed during planner selection."
        : "Run failed during local tool execution.";
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

  if (!hasApprovedArtifactGate(run)) {
    throw new RuntimeError(
      "RUN_NOT_APPROVABLE",
      "Artifact writing is blocked until a human approval is granted.",
      400,
    );
  }

  run.status = "running";
  run.summary = "Approval granted. Creating final artifact pack.";

  const artifactInput = buildArtifactWriteInput(run);
  const artifactResult = await executeToolForRun(run, artifactWriterToolName, artifactInput);
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
