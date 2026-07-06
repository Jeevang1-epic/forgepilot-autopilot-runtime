import {
  buildQwenPlannerSystemPrompt,
  buildQwenPlannerUserPrompt,
} from "./prompts";
import type {
  PlannerToolManifestItem,
  QwenConfigStatus,
  QwenPlannerCallInput,
  QwenPlannerCallResult,
} from "./types";

type QwenClient = {
  apiKey: string;
  baseUrl: string;
  model: string;
  chatCompletionsUrl: string;
};

type ChatCompletionResponse = {
  model?: string;
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
};

function getEnvValue(name: "QWEN_API_KEY" | "QWEN_BASE_URL" | "QWEN_MODEL") {
  return process.env[name]?.trim() ?? "";
}

function buildChatCompletionsUrl(baseUrl: string) {
  const trimmed = baseUrl.replace(/\/+$/, "");

  if (trimmed.endsWith("/chat/completions")) {
    return trimmed;
  }

  if (trimmed.endsWith("/v1")) {
    return `${trimmed}/chat/completions`;
  }

  return `${trimmed}/v1/chat/completions`;
}

export function getQwenConfigStatus(): QwenConfigStatus {
  const apiKeyConfigured = getEnvValue("QWEN_API_KEY").length > 0;
  const baseUrlConfigured = getEnvValue("QWEN_BASE_URL").length > 0;
  const modelConfigured = getEnvValue("QWEN_MODEL").length > 0;

  return {
    configured: apiKeyConfigured && baseUrlConfigured && modelConfigured,
    apiKeyConfigured,
    baseUrlConfigured,
    modelConfigured,
  };
}

export function hasQwenConfig() {
  return getQwenConfigStatus().configured;
}

export function createQwenClient(): QwenClient | null {
  const apiKey = getEnvValue("QWEN_API_KEY");
  const baseUrl = getEnvValue("QWEN_BASE_URL");
  const model = getEnvValue("QWEN_MODEL");

  if (!apiKey || !baseUrl || !model) {
    return null;
  }

  return {
    apiKey,
    baseUrl,
    model,
    chatCompletionsUrl: buildChatCompletionsUrl(baseUrl),
  };
}

export async function callQwenPlanner({
  goal,
  toolManifest,
}: QwenPlannerCallInput): Promise<QwenPlannerCallResult> {
  const client = createQwenClient();

  if (!client) {
    throw new Error("Qwen Cloud planner is not configured.");
  }

  const response = await fetch(client.chatCompletionsUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${client.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: client.model,
      temperature: 0.2,
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "system",
          content: buildQwenPlannerSystemPrompt(toolManifest),
        },
        {
          role: "user",
          content: buildQwenPlannerUserPrompt(goal),
        },
      ],
    }),
  });

  const payload = (await response.json()) as ChatCompletionResponse;

  if (!response.ok) {
    throw new Error(
      payload.error?.message ?? `Qwen planner request failed with ${response.status}.`,
    );
  }

  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Qwen planner returned an empty response.");
  }

  return {
    content,
    model: payload.model ?? client.model,
  };
}

export function createToolManifestForPrompt(
  tools: PlannerToolManifestItem[],
): PlannerToolManifestItem[] {
  return tools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    riskLevel: tool.riskLevel,
    requiresApproval: tool.requiresApproval,
    inputDescription: tool.inputDescription,
  }));
}
