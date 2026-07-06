import { fail, ok } from "@/lib/runtime/api-response";
import { runRuntimeSmokeTest } from "@/lib/runtime/runtime-smoke-test";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await runRuntimeSmokeTest();

  if (!result.ok) {
    return fail("RUNTIME_HEALTH_FAILED", "Runtime health check failed.", 500);
  }

  return ok(result);
}
