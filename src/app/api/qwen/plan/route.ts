import { createPlannerResolution } from "@/lib/qwen/planner";
import { failFromError, ok } from "@/lib/runtime/api-response";
import { plannerRequestSchema } from "@/lib/validation/schemas";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = plannerRequestSchema.parse(body);
    const planner = await createPlannerResolution({
      goal: input.goal,
      plannerMode: input.plannerMode,
    });

    return ok({
      planner,
    });
  } catch (error) {
    return failFromError(error);
  }
}
