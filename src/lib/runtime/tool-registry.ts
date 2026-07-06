import type { ToolDefinition, ToolExecutionContext } from "./types";
import { draftDevpostDescriptionTool } from "@/lib/tools/draft-devpost-description";
import { draftLinkedInPostTool } from "@/lib/tools/draft-linkedin-post";
import { generateArchitectureSummaryTool } from "@/lib/tools/generate-architecture-summary";
import { generateDemoScriptTool } from "@/lib/tools/generate-demo-script";
import { generateSubmissionChecklistTool } from "@/lib/tools/generate-submission-checklist";
import { requestHumanApprovalTool } from "@/lib/tools/request-human-approval";
import { scanProjectStatusTool } from "@/lib/tools/scan-project-status";
import { writeMarkdownFileTool } from "@/lib/tools/write-markdown-file";

export const runtimeTools = [
  scanProjectStatusTool,
  generateSubmissionChecklistTool,
  draftDevpostDescriptionTool,
  generateDemoScriptTool,
  draftLinkedInPostTool,
  generateArchitectureSummaryTool,
  requestHumanApprovalTool,
  writeMarkdownFileTool,
] satisfies ToolDefinition[];

const toolMap = new Map(runtimeTools.map((tool) => [tool.name, tool]));

export function listToolDefinitions() {
  return runtimeTools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    riskLevel: tool.riskLevel,
    requiresApproval: tool.requiresApproval,
  }));
}

export function getToolDefinition(name: string) {
  return toolMap.get(name);
}

export async function executeRegisteredTool(
  name: string,
  input: unknown,
  context: ToolExecutionContext,
) {
  const tool = getToolDefinition(name);

  if (!tool) {
    throw new Error(`Unknown runtime tool: ${name}`);
  }

  const parsedInput = tool.inputSchema.parse(input);
  const result = await tool.execute(parsedInput, context);

  return {
    tool,
    parsedInput,
    result,
  };
}
