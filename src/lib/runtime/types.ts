export type RunStatus =
  | "queued"
  | "planning"
  | "running"
  | "awaiting_approval"
  | "completed"
  | "failed";

export type TriggerType = "manual" | "webhook" | "scheduled";

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

export type ArtifactKind = "markdown" | "json" | "script" | "summary";

export type ToolCall = {
  id: string;
  name: string;
  provider: "local" | "qwen-cloud" | "runtime";
  status: ToolCallStatus;
  riskLevel: RiskLevel;
  inputSummary: string;
  outputSummary?: string;
  startedAt: string;
  completedAt?: string;
};

export type ApprovalRequest = {
  id: string;
  title: string;
  summary: string;
  status: ApprovalStatus;
  riskLevel: RiskLevel;
  requestedAt: string;
  approvedAt?: string;
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
  command: string;
  triggerType: TriggerType;
  status: RunStatus;
  summary: string;
  startedAt: string;
  completedAt?: string;
  timeline: TimelineStep[];
  toolCalls: ToolCall[];
  approvalRequests: ApprovalRequest[];
  artifacts: Artifact[];
};
