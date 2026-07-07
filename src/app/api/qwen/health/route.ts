import { getQwenConfigStatus } from "@/lib/qwen/client";
import { getOpenAICompatibleToolDefinitions } from "@/lib/qwen/tool-manifest";
import { ok } from "@/lib/runtime/api-response";

export const dynamic = "force-dynamic";

export function GET() {
  const qwen = getQwenConfigStatus();
  const toolManifestCount = getOpenAICompatibleToolDefinitions().length;

  return ok({
    qwen,
    qwenPlannerAvailable: qwen.configured,
    qwenToolCallingAvailable: qwen.configured && toolManifestCount > 0,
    toolManifestCount,
  });
}
