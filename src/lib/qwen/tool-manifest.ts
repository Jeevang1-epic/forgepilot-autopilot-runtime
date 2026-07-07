import { runtimeTools } from "@/lib/runtime/tool-registry";

type JsonSchema = {
  type: "object";
  properties: Record<string, unknown>;
  required?: string[];
  additionalProperties: boolean;
};

export type OpenAICompatibleToolDefinition = {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: JsonSchema;
  };
};

const emptyParameters: JsonSchema = {
  type: "object",
  properties: {},
  additionalProperties: false,
};

const markdownFileParameters: JsonSchema = {
  type: "object",
  properties: {
    files: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        properties: {
          fileName: {
            type: "string",
            minLength: 1,
          },
          kind: {
            type: "string",
            enum: ["markdown", "json", "script", "summary", "checklist"],
          },
          description: {
            type: "string",
            minLength: 1,
          },
          content: {
            type: "string",
            minLength: 1,
          },
        },
        required: ["fileName", "kind", "description", "content"],
        additionalProperties: false,
      },
    },
  },
  required: ["files"],
  additionalProperties: false,
};

function parametersForTool(toolName: string): JsonSchema {
  if (toolName === "write_markdown_file") {
    return markdownFileParameters;
  }

  return emptyParameters;
}

export function getOpenAICompatibleToolDefinitions(): OpenAICompatibleToolDefinition[] {
  return runtimeTools.map((tool) => ({
    type: "function",
    function: {
      name: tool.name,
      description: `${tool.description} Risk: ${tool.riskLevel}. Requires approval: ${tool.requiresApproval}.`,
      parameters: parametersForTool(tool.name),
    },
  }));
}
