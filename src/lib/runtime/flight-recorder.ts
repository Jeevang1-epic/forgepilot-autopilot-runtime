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
    createdAt: run.createdAt,
    completedAt: run.completedAt,
    finalSummary: run.finalSummary,
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
