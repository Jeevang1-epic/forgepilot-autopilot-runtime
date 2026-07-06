import type { CreateRunInput, ForgePilotRun, PlanStep } from "./types";

export const demoGoal = "Prepare my Qwen Cloud hackathon submission pack for ForgePilot.";

export function buildDeterministicPlan(): PlanStep[] {
  return [
    {
      id: "plan-trigger",
      title: "Trigger received",
      description: "Normalize the incoming goal and create a local runtime run record.",
      status: "completed",
      riskLevel: "low",
    },
    {
      id: "plan-build",
      title: "Build deterministic local plan",
      description: "Use the built-in local planner when requested or when Qwen fallback is needed.",
      status: "completed",
      riskLevel: "low",
    },
    {
      id: "plan-scan",
      title: "Scan project status",
      description: "Inspect the project state represented by this MVP runtime.",
      status: "pending",
      toolName: "scan_project_status",
      riskLevel: "low",
    },
    {
      id: "plan-checklist",
      title: "Generate submission checklist",
      description: "Produce a Qwen Cloud hackathon readiness checklist.",
      status: "pending",
      toolName: "generate_submission_checklist",
      riskLevel: "low",
    },
    {
      id: "plan-devpost",
      title: "Draft Devpost description",
      description: "Draft honest submission copy without claiming live Qwen integration.",
      status: "pending",
      toolName: "draft_devpost_description",
      riskLevel: "medium",
    },
    {
      id: "plan-demo-script",
      title: "Generate demo script",
      description: "Create a 3-minute walkthrough script for judges.",
      status: "pending",
      toolName: "generate_demo_script",
      riskLevel: "low",
    },
    {
      id: "plan-linkedin",
      title: "Draft LinkedIn post",
      description: "Create a restrained founder-style post for later review.",
      status: "pending",
      toolName: "draft_linkedin_post",
      riskLevel: "medium",
    },
    {
      id: "plan-architecture",
      title: "Generate architecture summary",
      description: "Summarize the local runtime flow and next Qwen phase.",
      status: "pending",
      toolName: "generate_architecture_summary",
      riskLevel: "low",
    },
    {
      id: "plan-approval",
      title: "Request human approval",
      description: "Pause before final artifact generation and completion.",
      status: "pending",
      toolName: "request_human_approval",
      requiresApproval: true,
      riskLevel: "medium",
    },
    {
      id: "plan-write",
      title: "Write markdown artifact pack",
      description: "Simulate safe artifact writing by creating artifact objects in state.",
      status: "pending",
      toolName: "write_markdown_file",
      riskLevel: "medium",
    },
    {
      id: "plan-report",
      title: "Complete run report",
      description: "Seal the run report with timeline, tools, approvals, and artifacts.",
      status: "pending",
      riskLevel: "low",
    },
  ];
}

export function createRunRecord(input: CreateRunInput): ForgePilotRun {
  const now = new Date().toISOString();

  return {
    id: `run-${crypto.randomUUID()}`,
    title: "Qwen Cloud submission pack",
    goal: input.goal,
    command: input.goal,
    triggerType: input.triggerType,
    status: "queued",
    summary: `Run queued for ${input.plannerMode ?? "auto"} planner mode.`,
    createdAt: now,
    startedAt: now,
    planSteps: buildDeterministicPlan(),
    timeline: [],
    toolCalls: [],
    approvalRequests: [],
    artifacts: [],
    plannerModeRequested: input.plannerMode ?? "auto",
    plannerModeUsed: "local",
    qwenConfigured: false,
    qwenJsonRepairUsed: false,
    plannerWarnings: [],
  };
}
