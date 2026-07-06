import { getQwenConfigStatus } from "@/lib/qwen/client";
import { ok } from "@/lib/runtime/api-response";

export const dynamic = "force-dynamic";

export function GET() {
  return ok({
    qwen: getQwenConfigStatus(),
  });
}
