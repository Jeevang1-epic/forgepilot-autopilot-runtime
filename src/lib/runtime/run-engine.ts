import { createRunSchema } from "@/lib/validation/schemas";

import { buildRunReport, recordTimelineStep } from "./flight-recorder";
import { getRun, saveRun } from "./run-store";
import { createRunRecord, demoGoal } from "./trigger-engine";
import type { CreateRunInput } from "./types";

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

export function sealFailedRun(runId: string, error: string) {
  const run = getRun(runId);

  if (!run) {
    return undefined;
  }

  run.status = "failed";
  run.error = error;
  run.completedAt = new Date().toISOString();
  run.finalSummary = "Run stopped before completion.";
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
