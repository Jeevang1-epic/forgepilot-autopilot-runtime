import type { z } from "zod";

export type RunStatus =
  | "queued"
  | "planning"
  | "running"
  | "awaiting_approval"
  | "completed"
  | "failed";

export type TriggerType = "manual" | "webhook" | "scheduled_demo";

export type TimelineStepStatus =
  | "pending"
  | "running"
  | "completed"
  | "blocked"
  | "approval_required";

export type ToolCallStatus = "queued" | "running" | "completed" | "failed";

export type ApprovalStatus = "requested" | "approved" | "rejected" | "expired";

export type ArtifactStatus = "drafted" | "written" | "approved";

export type RiskLevel = "low" | "medium" | "high";

export type ArtifactKind = "markdown" | "json" | "script" | "summary" | "checklist";

export type PlanStepStatus = "pending" | "running" | "completed" | "awaiting_approval";

export type ToolProvider = "local" | "qwen-cloud" | "runtime";

export type PlannerModeRequested = "local" | "qwen" | "auto";

export type PlannerModeUsed = "local" | "qwen" | "qwen_repaired" | "local_fallback";

export type PlanStep = {
  id: string;
  title: string;
  description: string;
  status: PlanStepStatus;
  toolName?: string;
  requiresApproval?: boolean;
  riskLevel?: RiskLevel;
};

export type ToolExecutionContext = {
  runId: string;
  goal: string;
  now: string;
};

export type ToolExecutionResult = {
  summary: string;
  data?: unknown;
};

export type ToolDefinition<TInput = unknown> = {
  name: string;
  description: string;
  inputSchema: z.ZodType<TInput>;
  riskLevel: RiskLevel;
  requiresApproval: boolean;
  execute: (
    input: TInput,
    context: ToolExecutionContext,
  ) => ToolExecutionResult | Promise<ToolExecutionResult>;
};

export type ToolCall = {
  id: string;
  name: string;
  provider: ToolProvider;
  status: ToolCallStatus;
  riskLevel: RiskLevel;
  inputSummary: string;
  input?: unknown;
  outputSummary?: string;
  output?: unknown;
  startedAt: string;
  completedAt?: string;
};

export type ApprovalRequest = {
  id: string;
  runId?: string;
  title: string;
  summary: string;
  reason?: string;
  status: ApprovalStatus;
  riskLevel: RiskLevel;
  requestedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  approver?: string;
};

export type Artifact = {
  id: string;
  fileName: string;
  kind: ArtifactKind;
  description: string;
  status: ArtifactStatus;
  path: string;
  size: string;
  fileType?: string;
  content?: string;
  generatedAt?: string;
};

export type TimelineStep = {
  id: string;
  title: string;
  status: TimelineStepStatus;
  timestamp: string;
  description: string;
  toolName?: string;
  toolCallId?: string;
  riskLevel?: RiskLevel;
};

export type ForgePilotRun = {
  id: string;
  title: string;
  goal: string;
  command: string;
  triggerType: TriggerType;
  status: RunStatus;
  summary: string;
  finalSummary?: string;
  createdAt: string;
  startedAt: string;
  completedAt?: string;
  planSteps: PlanStep[];
  timeline: TimelineStep[];
  toolCalls: ToolCall[];
  approvalRequests: ApprovalRequest[];
  artifacts: Artifact[];
  report?: Record<string, unknown>;
  error?: string;
  plannerModeRequested: PlannerModeRequested;
  plannerModeUsed: PlannerModeUsed;
  qwenModel?: string;
  qwenConfigured: boolean;
  plannerWarnings: string[];
};

export type CreateRunInput = {
  goal: string;
  triggerType: TriggerType;
  plannerMode?: PlannerModeRequested;
};

export type ApprovalDecision = "approved" | "rejected";

export type ApprovalDecisionInput = {
  approvalId: string;
  decision: ApprovalDecision;
};
