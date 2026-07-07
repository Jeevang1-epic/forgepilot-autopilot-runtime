import { ZodError } from "zod";

import { createQwenClient } from "./client";
import {
  buildQwenToolCallSystemPrompt,
  buildQwenToolCallUserPrompt,
} from "./prompts";
import { getOpenAICompatibleToolDefinitions } from "./tool-manifest";
import { RuntimeError } from "@/lib/runtime/errors";
import { getToolDefinition } from "@/lib/runtime/tool-registry";
import type { ExecutionModeRequested, RiskLevel } from "@/lib/runtime/types";

type ChatToolCall = {
  id?: string;
  type?: string;
  function?: {
    name?: string;
    arguments?: string;
  };
};

type ChatCompletionToolResponse = {
  model?: string;
  choices?: Array<{
    message?: {
      content?: string | null;
      tool_calls?: ChatToolCall[];
    };
  }>;
  error?: {
    message?: string;
  };
};

export type QwenToolCallInput = {
  goal: string;
  context: Record<string, unknown>;
  completedTools: string[];
  requiredTools: string[];
  executionMode: ExecutionModeRequested;
};

export type QwenValidatedToolCall = {
  id?: string;
  name: string;
  arguments: unknown;
  parsedArguments: unknown;
  riskLevel: RiskLevel;
  requiresApproval: boolean;
};

export type QwenToolCallResult = {
  ok: boolean;
  qwenConfigured: boolean;
  qwenModel?: string;
  selectedToolCall?: QwenValidatedToolCall;
  validation: {
    passed: boolean;
    reason: string;
  };
  warnings: string[];
};

function parseArguments(rawArguments: string | undefined) {
  if (!rawArguments?.trim()) {
    return {};
  }

  return JSON.parse(rawArguments) as unknown;
}

function validateToolCall(toolCall: ChatToolCall | undefined): QwenToolCallResult {
  if (!toolCall?.function?.name) {
    return {
      ok: false,
      qwenConfigured: true,
      validation: {
        passed: false,
        reason: "Qwen did not return a tool call.",
      },
      warnings: ["Qwen did not select a tool; runtime can continue with local fallback."],
    };
  }

  const tool = getToolDefinition(toolCall.function.name);

  if (!tool) {
    return {
      ok: false,
      qwenConfigured: true,
      validation: {
        passed: false,
        reason: `Qwen selected unknown tool: ${toolCall.function.name}`,
      },
      warnings: [`Unknown Qwen tool selection blocked: ${toolCall.function.name}`],
    };
  }

  try {
    const args = parseArguments(toolCall.function.arguments);
    const parsedArguments = tool.inputSchema.parse(args);

    return {
      ok: true,
      qwenConfigured: true,
      selectedToolCall: {
        id: toolCall.id,
        name: tool.name,
        arguments: args,
        parsedArguments,
        riskLevel: tool.riskLevel,
        requiresApproval: tool.requiresApproval,
      },
      validation: {
        passed: true,
        reason: "Tool call passed local registry validation.",
      },
      warnings: [],
    };
  } catch (error) {
    return {
      ok: false,
      qwenConfigured: true,
      validation: {
        passed: false,
        reason:
          error instanceof ZodError
            ? "Qwen tool arguments did not match the local tool schema."
            : "Qwen tool arguments were not valid JSON.",
      },
      warnings: [
        error instanceof Error
          ? `Qwen tool-call validation failed: ${error.message}`
          : "Qwen tool-call validation failed.",
      ],
    };
  }
}

export async function callQwenForNextTool(
  input: QwenToolCallInput,
): Promise<QwenToolCallResult> {
  const client = createQwenClient();

  if (!client) {
    return {
      ok: false,
      qwenConfigured: false,
      validation: {
        passed: false,
        reason: "Qwen Cloud tool calling is not configured.",
      },
      warnings: [
        "Qwen Cloud env vars are not configured, so tool calling cannot run.",
      ],
    };
  }

  const response = await fetch(client.chatCompletionsUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${client.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: client.model,
      temperature: 0.1,
      tool_choice: "auto",
      tools: getOpenAICompatibleToolDefinitions(),
      messages: [
        {
          role: "system",
          content: buildQwenToolCallSystemPrompt(),
        },
        {
          role: "user",
          content: buildQwenToolCallUserPrompt(input),
        },
      ],
    }),
  });

  const payload = (await response.json()) as ChatCompletionToolResponse;

  if (!response.ok) {
    throw new RuntimeError(
      "QWEN_TOOL_CALL_FAILED",
      payload.error?.message ??
        `Qwen tool-call request failed with ${response.status}.`,
      502,
    );
  }

  const toolCall = payload.choices?.[0]?.message?.tool_calls?.[0];
  const validated = validateToolCall(toolCall);

  return {
    ...validated,
    qwenConfigured: true,
    qwenModel: payload.model ?? client.model,
  };
}
