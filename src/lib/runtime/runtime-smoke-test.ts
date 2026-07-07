import { existsSync } from "node:fs";

import { getQwenConfigStatus } from "@/lib/qwen/client";
import { getOpenAICompatibleToolDefinitions } from "@/lib/qwen/tool-manifest";
import { getWebhookConfigStatus } from "@/lib/runtime/webhook-config";

import {
  approveRunAction,
  continueRunAfterApproval,
  createDemoAutopilotRun,
  executeAutopilotRun,
  maxQwenToolSteps,
  rejectRunAction,
} from "./run-engine";
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

function addCheck(checks: HealthCheck[], name: string, ok: boolean, detail: string) {
  checks.push({ name, ok, detail });
}

export async function runRuntimeSmokeTest() {
  const checks: HealthCheck[] = [];
  const qwenConfigSafeStatus = getQwenConfigStatus();
  const webhookConfigStatus = getWebhookConfigStatus();
  const tools = listToolDefinitions();
  const toolManifest = getPlannerToolManifest();
  const qwenToolManifest = getOpenAICompatibleToolDefinitions();
  const toolNames = new Set(tools.map((tool) => tool.name));
  const missingTools = expectedTools.filter((toolName) => !toolNames.has(toolName));

  addCheck(
    checks,
    "tool registry",
    missingTools.length === 0,
    missingTools.length === 0
      ? `${tools.length} tools registered.`
      : `Missing tools: ${missingTools.join(", ")}`,
  );

  addCheck(
    checks,
    "qwen tool manifest",
    qwenToolManifest.length === expectedTools.length,
    `${qwenToolManifest.length} Qwen-safe tool definitions exposed.`,
  );

  const markerHits = forbiddenMarkers.filter(markerExists);

  addCheck(
    checks,
    "forbidden marker files",
    markerHits.length === 0,
    markerHits.length === 0
      ? "No forbidden marker files found."
      : `Found forbidden markers: ${markerHits.join(", ")}`,
  );

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

  addCheck(
    checks,
    "demo run pauses",
    awaitingRun.status === "awaiting_approval" && Boolean(approval),
    `Run status after execution: ${awaitingRun.status}.`,
  );

  let artifactBlockedBeforeApproval = false;

  try {
    await continueRunAfterApproval(awaitingRun.id);
  } catch {
    artifactBlockedBeforeApproval = true;
  }

  addCheck(
    checks,
    "artifact writer blocked before approval",
    artifactBlockedBeforeApproval && awaitingRun.artifacts.length === 0,
    artifactBlockedBeforeApproval
      ? "Artifact writer could not continue before approval."
      : "Artifact writer was not blocked before approval.",
  );

  const completedRun = approval
    ? await approveRunAction({
        approvalId: approval.id,
        decision: "approved",
      })
    : awaitingRun;

  addCheck(
    checks,
    "approval completes run",
    completedRun.status === "completed",
    `Run status after approval: ${completedRun.status}.`,
  );

  addCheck(
    checks,
    "artifacts produced",
    completedRun.artifacts.length >= 5,
    `${completedRun.artifacts.length} artifacts present.`,
  );

  const artifactCountAfterApproval = completedRun.artifacts.length;
  const duplicateApprovalRun = approval
    ? await approveRunAction({
        approvalId: approval.id,
        decision: "approved",
      })
    : completedRun;

  addCheck(
    checks,
    "duplicate approval is idempotent",
    duplicateApprovalRun.artifacts.length === artifactCountAfterApproval,
    `${duplicateApprovalRun.artifacts.length} artifacts after duplicate approval.`,
  );

  const rejectedRunSeed = createDemoAutopilotRun({
    plannerMode: "local",
    executionMode: "local",
  });
  const awaitingRejectedRun = await executeAutopilotRun(rejectedRunSeed.id);
  const rejectedApproval = awaitingRejectedRun.approvalRequests.find(
    (request) => request.status === "requested",
  );
  const rejectedRun = rejectedApproval
    ? await rejectRunAction({
        approvalId: rejectedApproval.id,
        decision: "rejected",
      })
    : awaitingRejectedRun;

  addCheck(
    checks,
    "rejected approval stops safely",
    rejectedRun.status === "failed" && rejectedRun.artifacts.length === 0,
    `Rejected run status: ${rejectedRun.status}; artifacts: ${rejectedRun.artifacts.length}.`,
  );

  const autoRunSeed = createDemoAutopilotRun({
    plannerMode: "auto",
    executionMode: "auto",
  });
  const autoRun = await executeAutopilotRun(autoRunSeed.id);
  const autoFallbackOk = qwenConfigSafeStatus.configured
    ? autoRun.qwenConfigured
    : autoRun.executionModeUsed === "local_fallback" &&
      autoRun.qwenToolCallWarnings.some((warning) =>
        warning.includes("local fallback"),
      );

  addCheck(
    checks,
    "auto mode fallback",
    autoFallbackOk,
    qwenConfigSafeStatus.configured
      ? "Qwen configured; auto mode can use Qwen."
      : `Auto mode used ${autoRun.executionModeUsed}.`,
  );

  const qwenToolsRunSeed = createDemoAutopilotRun({
    plannerMode: "local",
    executionMode: "qwen_tools",
  });
  const qwenToolsRun = await executeAutopilotRun(qwenToolsRunSeed.id);
  const qwenToolsMissingEnvOk = qwenConfigSafeStatus.configured
    ? qwenToolsRun.qwenToolCallingAvailable
    : qwenToolsRun.executionModeUsed === "local_fallback" &&
      qwenToolsRun.qwenToolCallWarnings.some((warning) =>
        warning.includes("Qwen Tool Calling unavailable"),
      );

  addCheck(
    checks,
    "qwen_tools missing-env handling",
    qwenToolsMissingEnvOk,
    qwenConfigSafeStatus.configured
      ? "Qwen tool calling is configured."
      : `qwen_tools used ${qwenToolsRun.executionModeUsed} without crashing.`,
  );

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
    maxQwenToolSteps,
    webhookTriggerAvailable: true,
    webhookSecretConfigured: webhookConfigStatus.secretConfigured,
    webhookEndpoint: webhookConfigStatus.endpoint,
    webhookSecretHeader: webhookConfigStatus.secretHeader,
    supportedTriggerTypes: ["manual", "webhook", "scheduled_demo"] as const,
    supportedPlannerModes: ["local", "qwen", "auto"] as const,
    supportedExecutionModes: ["local", "qwen_plan", "qwen_tools", "auto"] as const,
    safetyNote: "Final artifact writing still requires approval.",
    webhookSafetyNote: webhookConfigStatus.secretConfigured
      ? "Webhook shared-secret protection is configured."
      : "Webhook secret is not configured; local demo calls are allowed, but production should set FORGEPILOT_WEBHOOK_SECRET.",
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
