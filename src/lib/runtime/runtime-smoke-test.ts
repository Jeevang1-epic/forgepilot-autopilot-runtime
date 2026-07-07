import { existsSync } from "node:fs";

import { getQwenConfigStatus } from "@/lib/qwen/client";
import { getOpenAICompatibleToolDefinitions } from "@/lib/qwen/tool-manifest";

import { approveRunAction, createDemoAutopilotRun, executeAutopilotRun } from "./run-engine";
import { getPlannerToolManifest, listToolDefinitions } from "./tool-registry";

const expectedTools = [
  "scan_project_status",
  "generate_submission_checklist",
  "draft_devpost_description",
  "generate_demo_script",
  "draft_linkedin_post",
  "generate_architecture_summary",
  "request_human_approval",
  "write_markdown_file",
];

const forbiddenMarkers = [
  "CLAUDE.md",
  "AGENTS.md",
  ".cursor/rules",
  ".windsurfrules",
  ".agents",
];

type HealthCheck = {
  name: string;
  ok: boolean;
  detail: string;
};

function markerExists(markerPath: string) {
  return existsSync(markerPath);
}

export async function runRuntimeSmokeTest() {
  const checks: HealthCheck[] = [];
  const qwenConfigSafeStatus = getQwenConfigStatus();
  const tools = listToolDefinitions();
  const toolManifest = getPlannerToolManifest();
  const qwenToolManifest = getOpenAICompatibleToolDefinitions();
  const toolNames = new Set(tools.map((tool) => tool.name));
  const missingTools = expectedTools.filter((toolName) => !toolNames.has(toolName));

  checks.push({
    name: "tool registry",
    ok: missingTools.length === 0,
    detail:
      missingTools.length === 0
        ? `${tools.length} tools registered.`
        : `Missing tools: ${missingTools.join(", ")}`,
  });

  const markerHits = forbiddenMarkers.filter(markerExists);

  checks.push({
    name: "forbidden marker files",
    ok: markerHits.length === 0,
    detail:
      markerHits.length === 0
        ? "No forbidden marker files found."
        : `Found forbidden markers: ${markerHits.join(", ")}`,
  });

  const run = createDemoAutopilotRun({
    plannerMode: "local",
    executionMode: "local",
  });
  const awaitingRun = await executeAutopilotRun(run.id);
  const approval = awaitingRun.approvalRequests.find(
    (request) => request.status === "requested",
  );
  const demoRunHealth = {
    status: awaitingRun.status,
    plannerModeUsed: awaitingRun.plannerModeUsed,
    hasPendingApproval: Boolean(approval),
  };

  checks.push({
    name: "demo run pauses",
    ok: awaitingRun.status === "awaiting_approval" && Boolean(approval),
    detail: `Run status after execution: ${awaitingRun.status}.`,
  });

  const completedRun = approval
    ? await approveRunAction({
        approvalId: approval.id,
        decision: "approved",
      })
    : awaitingRun;

  checks.push({
    name: "approval completes run",
    ok: completedRun.status === "completed",
    detail: `Run status after approval: ${completedRun.status}.`,
  });

  checks.push({
    name: "artifacts produced",
    ok: completedRun.artifacts.length >= 5,
    detail: `${completedRun.artifacts.length} artifacts present.`,
  });

  const ok = checks.every((check) => check.ok);

  return {
    ok,
    checkedAt: new Date().toISOString(),
    qwenConfigSafeStatus,
    qwenConfigured: qwenConfigSafeStatus.configured,
    qwenPlannerAvailable: qwenConfigSafeStatus.configured,
    qwenToolCallingAvailable:
      qwenConfigSafeStatus.configured && qwenToolManifest.length === tools.length,
    plannerModesAvailable: ["local", "qwen", "auto"] as const,
    executionModesAvailable: ["local", "qwen_plan", "qwen_tools", "auto"] as const,
    toolManifestCount: toolManifest.length,
    qwenToolManifestCount: qwenToolManifest.length,
    demoRunHealth,
    approvalHealth: {
      status: completedRun.status,
      approvalCount: completedRun.approvalRequests.length,
    },
    artifactHealth: {
      artifactCount: completedRun.artifacts.length,
      hasRunReport: completedRun.artifacts.some(
        (artifact) => artifact.fileName === "run-report.json",
      ),
    },
    checks,
    runId: completedRun.id,
  };
}
