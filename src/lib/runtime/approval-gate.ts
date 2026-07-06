import { approvalDecisionSchema } from "@/lib/validation/schemas";

import { buildRunReport, recordTimelineStep } from "./flight-recorder";
import { findRunByApprovalId, saveRun } from "./run-store";
import type { ApprovalDecisionInput, ApprovalRequest, ForgePilotRun } from "./types";

export function getPendingApproval(run: ForgePilotRun) {
  return run.approvalRequests.find((approval) => approval.status === "requested");
}

export function parseApprovalRequest(data: unknown): ApprovalRequest {
  if (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "title" in data &&
    "status" in data
  ) {
    return data as ApprovalRequest;
  }

  throw new Error("Approval tool returned an invalid approval request.");
}

export function approvePendingApproval(input: ApprovalDecisionInput) {
  const parsedInput = approvalDecisionSchema.parse(input);
  const run = findRunByApprovalId(parsedInput.approvalId);

  if (!run) {
    throw new Error("Approval request not found.");
  }

  const approval = run.approvalRequests.find(
    (item) => item.id === parsedInput.approvalId,
  );

  if (!approval) {
    throw new Error("Approval request not found.");
  }

  if (approval.status !== "requested") {
    return run;
  }

  if (parsedInput.decision === "approved") {
    approval.status = "approved";
    approval.approvedAt = new Date().toISOString();
    approval.approver = "Local operator";
    run.status = "running";

    recordTimelineStep(run, {
      title: "Human approval granted",
      description: "Operator approved final artifact generation.",
      toolName: "approval.gate",
      riskLevel: approval.riskLevel,
    });
  } else {
    approval.status = "rejected";
    approval.rejectedAt = new Date().toISOString();
    run.status = "failed";
    run.completedAt = new Date().toISOString();
    run.finalSummary = "Run stopped safely after approval was rejected.";
    run.error = "Final artifact generation was rejected by the operator.";

    recordTimelineStep(run, {
      title: "Human approval rejected",
      description: "Runtime stopped safely before writing final artifact objects.",
      status: "blocked",
      toolName: "approval.gate",
      riskLevel: approval.riskLevel,
    });

    run.report = buildRunReport(run);
  }

  return saveRun(run);
}
