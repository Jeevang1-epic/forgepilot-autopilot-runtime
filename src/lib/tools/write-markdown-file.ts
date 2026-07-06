import { markdownFileInputSchema } from "@/lib/validation/schemas";
import type { Artifact, ToolDefinition } from "@/lib/runtime/types";
import type { MarkdownFileInput } from "@/lib/validation/schemas";

function estimateSize(content: string) {
  const kilobytes = Math.max(0.1, content.length / 1024);
  return `${kilobytes.toFixed(1)} KB`;
}

export const writeMarkdownFileTool: ToolDefinition<MarkdownFileInput> = {
  name: "write_markdown_file",
  description: "Simulates safe artifact writing by creating artifact objects in run state.",
  inputSchema: markdownFileInputSchema,
  riskLevel: "medium",
  requiresApproval: true,
  execute: (input, context) => {
    const artifacts: Artifact[] = input.files.map((file) => ({
      id: `artifact-${crypto.randomUUID()}`,
      fileName: file.fileName,
      kind: file.kind,
      description: file.description,
      status: "written",
      path: `runtime-artifacts/${file.fileName}`,
      fileType: file.kind === "json" ? "application/json" : "text/markdown",
      content: file.content,
      generatedAt: context.now,
      size: estimateSize(file.content),
    }));

    return {
      summary: `${artifacts.length} artifact objects created in local runtime state.`,
      data: artifacts,
    };
  },
};
