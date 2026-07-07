import { callQwenForNextTool } from "@/lib/qwen/tool-calling";
import { fail, failFromError, ok } from "@/lib/runtime/api-response";
import { qwenToolCallRequestSchema } from "@/lib/validation/schemas";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = qwenToolCallRequestSchema.parse(body);

    if (input.executionMode === "local" || input.executionMode === "qwen_plan") {
      return ok({
        toolCall: {
          ok: false,
          qwenConfigured: false,
          qwenToolCallingAvailable: false,
          validation: {
            passed: false,
            reason: `${input.executionMode} mode does not request Qwen tool calling.`,
          },
          fallbackAction: "none",
          warnings: ["No Qwen tool call was requested for this execution mode."],
        },
      });
    }

    const toolCall = await callQwenForNextTool({
      goal: input.goal,
      context: input.context,
      completedTools: Array.isArray(input.context.completedTools)
        ? input.context.completedTools.map(String)
        : [],
      requiredTools: [
        "scan_project_status",
        "generate_submission_checklist",
        "draft_devpost_description",
        "generate_demo_script",
        "draft_linkedin_post",
        "generate_architecture_summary",
        "request_human_approval",
      ],
      executionMode: input.executionMode,
    });

    if (
      input.executionMode === "qwen_tools" &&
      !input.allowFallback &&
      !toolCall.qwenConfigured
    ) {
      return fail(
        "QWEN_NOT_CONFIGURED",
        "Qwen tool calling requires QWEN_API_KEY, QWEN_BASE_URL, and QWEN_MODEL. Use auto mode or allowFallback for local fallback testing.",
        400,
      );
    }

    return ok({ toolCall });
  } catch (error) {
    return failFromError(error);
  }
}
