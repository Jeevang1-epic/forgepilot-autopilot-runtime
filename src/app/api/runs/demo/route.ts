import { failFromError, ok } from "@/lib/runtime/api-response";
import {
  createDemoAutopilotRun,
  executeAutopilotRun,
} from "@/lib/runtime/run-engine";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const run = createDemoAutopilotRun();
    const executedRun = await executeAutopilotRun(run.id);

    return ok({ run: executedRun }, 201);
  } catch (error) {
    return failFromError(error);
  }
}
