import { fail, ok } from "@/lib/runtime/api-response";
import { getRun } from "@/lib/runtime/run-store";

export const dynamic = "force-dynamic";

type RunRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RunRouteContext) {
  const { id } = await context.params;
  const run = getRun(id);

  if (!run) {
    return fail("RUN_NOT_FOUND", "Run not found.", 404);
  }

  return ok({ run });
}
