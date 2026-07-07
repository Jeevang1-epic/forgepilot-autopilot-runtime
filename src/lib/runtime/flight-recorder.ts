import type {
  ForgePilotRun,
  RiskLevel,
  TimelineStep,
  TimelineStepStatus,
  ToolCall,
} from "./types";

type TimelineInput = {
  title: string;
  description: string;
  status?: TimelineStepStatus;
  toolName?: string;
  toolCallId?: string;
  riskLevel?: RiskLevel;
};

export function createTimelineStep(input: TimelineInput): TimelineStep {
  return {
    id: `step-${crypto.randomUUID()}`,
    title: input.title,
    description: input.description,
    status: input.status ?? "completed",
    timestamp: new Date().toISOString(),
    toolName: input.toolName,
    toolCallId: input.toolCallId,
    riskLevel: input.riskLevel,
  };
}

export function recordTimelineStep(run: ForgePilotRun, input: TimelineInput) {
  run.timeline.push(createTimelineStep(input));
}

export function recordToolCall(run: ForgePilotRun, toolCall: ToolCall) {
  run.toolCalls.push(toolCall);
}

export function buildRunReport(run: ForgePilotRun) {
  return {
    runId: run.id,
    goal: run.goal,
    status: run.status,
    triggerType: run.triggerType,
    triggerMetadata: run.triggerMetadata,
    createdAt: run.createdAt,
    completedAt: run.completedAt,
    plannerModeRequested: run.plannerModeRequested,
    plannerModeUsed: run.plannerModeUsed,
    qwenConfigured: run.qwenConfigured,
    qwenModel: run.qwenModel,
    qwenJsonRepairUsed: run.qwenJsonRepairUsed,
    plannerWarnings: run.plannerWarnings,
    executionModeRequested: run.executionModeRequested,
    executionModeUsed: run.executionModeUsed,
    qwenToolCallingAvailable: run.qwenToolCallingAvailable,
    qwenToolCallingUsed: run.qwenToolCallingUsed,
    qwenToolCallWarnings: run.qwenToolCallWarnings,
    toolManifestCount: run.toolManifestCount,
    selectedToolsCount: run.selectedToolsCount,
    locallyCompletedToolsCount: run.locallyCompletedToolsCount,
    blockedUnsafeToolCallsCount: run.blockedUnsafeToolCallsCount,
    maxToolLoopHit: run.maxToolLoopHit,
    blockedUnsafeToolCalls: run.blockedUnsafeToolCalls,
    planSteps: run.planSteps,
    summary: run.summary,
    finalSummary: run.finalSummary,
    error: run.error,
    timeline: run.timeline,
    toolCalls: run.toolCalls,
    approvalRequests: run.approvalRequests,
    artifacts: run.artifacts.map((artifact) => ({
      id: artifact.id,
      fileName: artifact.fileName,
      kind: artifact.kind,
      status: artifact.status,
      size: artifact.size,
      generatedAt: artifact.generatedAt,
    })),
  };
}
