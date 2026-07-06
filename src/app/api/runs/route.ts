import { failFromError, ok } from "@/lib/runtime/api-response";
import { createAutopilotRun } from "@/lib/runtime/run-engine";
import { listRuns } from "@/lib/runtime/run-store";
import { createRunSchema } from "@/lib/validation/schemas";

export const dynamic = "force-dynamic";

export function GET() {
  return ok({
    runs: listRuns(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = createRunSchema.parse(body);
    const run = createAutopilotRun(input);

    return ok({ run }, 201);
  } catch (error) {
    return failFromError(error);
  }
}
