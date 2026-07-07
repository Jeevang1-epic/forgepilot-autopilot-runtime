import { fail, failFromError, ok } from "@/lib/runtime/api-response";
import {
  createAutopilotRun,
  executeAutopilotRun,
} from "@/lib/runtime/run-engine";
import {
  forgePilotWebhookEndpoint,
  isWebhookSecretValid,
} from "@/lib/runtime/webhook-config";
import { webhookTriggerRequestSchema } from "@/lib/validation/schemas";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    if (!isWebhookSecretValid(request)) {
      return fail(
        "WEBHOOK_UNAUTHORIZED",
        "Invalid or missing ForgePilot webhook secret.",
        401,
      );
    }

    const body = await request.json();
    const input = webhookTriggerRequestSchema.parse(body);
    const run = createAutopilotRun({
      goal: input.goal,
      triggerType: "webhook",
      plannerMode: input.plannerMode,
      executionMode: input.executionMode,
      triggerMetadata: {
        source: input.source,
        triggerName: input.metadata.triggerName,
        requestId: input.metadata.requestId,
        notes: input.metadata.notes,
      },
    });
    const executedRun = await executeAutopilotRun(run.id);
    const approvalRequired = executedRun.approvalRequests.some(
      (approval) => approval.status === "requested",
    );

    return ok(
      {
        runId: executedRun.id,
        status: executedRun.status,
        triggerType: executedRun.triggerType,
        plannerModeUsed: executedRun.plannerModeUsed,
        executionModeUsed: executedRun.executionModeUsed,
        approvalRequired,
        artifactsCount: executedRun.artifacts.length,
        runUrl: `/run/demo?runId=${executedRun.id}`,
        webhookEndpoint: forgePilotWebhookEndpoint,
      },
      201,
    );
  } catch (error) {
    return failFromError(error);
  }
}
