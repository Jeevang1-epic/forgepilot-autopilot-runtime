import { failFromError, ok } from "@/lib/runtime/api-response";
import {
  createDemoAutopilotRun,
  executeAutopilotRun,
} from "@/lib/runtime/run-engine";
import { demoRunRequestSchema } from "@/lib/validation/schemas";

export const dynamic = "force-dynamic";

async function readOptionalJson(request: Request) {
  const text = await request.text();

  if (!text.trim()) {
    return {};
  }

  return JSON.parse(text) as unknown;
}

export async function POST(request: Request) {
  try {
    const body = await readOptionalJson(request);
    const input = demoRunRequestSchema.parse(body);
    const run = createDemoAutopilotRun(input);
    const executedRun = await executeAutopilotRun(run.id);

    return ok({ run: executedRun }, 201);
  } catch (error) {
    return failFromError(error);
  }
}
