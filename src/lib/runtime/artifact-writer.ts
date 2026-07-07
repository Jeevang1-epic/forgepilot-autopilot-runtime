import type { Artifact } from "./types";
import type { MarkdownFileInput } from "@/lib/validation/schemas";
import type { ForgePilotRun } from "./types";

type FileDraft = {
  fileName: string;
  content: string;
};

function getToolOutputData(run: ForgePilotRun, toolName: string) {
  return run.toolCalls.find((toolCall) => toolCall.name === toolName)?.output;
}

function getDraftContent(run: ForgePilotRun, toolName: string, fallback: string): FileDraft {
  const data = getToolOutputData(run, toolName);

  if (
    typeof data === "object" &&
    data !== null &&
    "fileName" in data &&
    "content" in data &&
    typeof data.fileName === "string" &&
    typeof data.content === "string"
  ) {
    return {
      fileName: data.fileName,
      content: data.content,
    };
  }

  return {
    fileName: `${toolName}.md`,
    content: fallback,
  };
}

function buildChecklistMarkdown(run: ForgePilotRun) {
  const data = getToolOutputData(run, "generate_submission_checklist");

  if (
    typeof data === "object" &&
    data !== null &&
    "items" in data &&
    Array.isArray(data.items)
  ) {
    const items = data.items
      .map((item) => {
        if (
          typeof item === "object" &&
          item !== null &&
          "label" in item &&
          "status" in item
        ) {
          return `- ${String(item.label)}: ${String(item.status)}`;
        }

        return undefined;
      })
      .filter(Boolean)
      .join("\n");

    return `# Submission Checklist\n\n${items}`;
  }

  return "# Submission Checklist\n\n- Checklist data unavailable.";
}

export function buildArtifactWriteInput(run: ForgePilotRun): MarkdownFileInput {
  const devpost = getDraftContent(
    run,
    "draft_devpost_description",
    "Devpost draft unavailable.",
  );
  const demoScript = getDraftContent(
    run,
    "generate_demo_script",
    "Demo script unavailable.",
  );
  const linkedin = getDraftContent(
    run,
    "draft_linkedin_post",
    "LinkedIn draft unavailable.",
  );
  const architecture = getDraftContent(
    run,
    "generate_architecture_summary",
    "Architecture summary unavailable.",
  );
  const checklist = buildChecklistMarkdown(run);
  const report = {
    runId: run.id,
    goal: run.goal,
    status: run.status,
    plannerModeRequested: run.plannerModeRequested,
    plannerModeUsed: run.plannerModeUsed,
    qwenConfigured: run.qwenConfigured,
    qwenModel: run.qwenModel,
    qwenJsonRepairUsed: run.qwenJsonRepairUsed,
    executionModeRequested: run.executionModeRequested,
    executionModeUsed: run.executionModeUsed,
    qwenToolCallingUsed: run.qwenToolCallingUsed,
    qwenToolCallWarnings: run.qwenToolCallWarnings,
    blockedUnsafeToolCalls: run.blockedUnsafeToolCalls,
    timelineCount: run.timeline.length,
    toolCallCount: run.toolCalls.length,
    approvalCount: run.approvalRequests.length,
  };

  return {
    files: [
      {
        fileName: "submission-pack.md",
        kind: "markdown",
        description: "Combined hackathon checklist and Devpost submission draft.",
        content: `# ForgePilot Submission Pack\n\n## Goal\n${run.goal}\n\n${checklist}\n\n## Devpost Draft\n${devpost.content}`,
      },
      {
        fileName: "demo-script.md",
        kind: "script",
        description: "Three-minute demo script for judge walkthrough.",
        content: demoScript.content,
      },
      {
        fileName: "linkedin-post.md",
        kind: "markdown",
        description: "Founder-style launch post drafted for review.",
        content: linkedin.content,
      },
      {
        fileName: "architecture-summary.md",
        kind: "summary",
        description: "Concise architecture summary for the submission pack.",
        content: architecture.content,
      },
      {
        fileName: "run-report.json",
        kind: "json",
        description: "Structured local runtime report snapshot.",
        content: JSON.stringify(report, null, 2),
      },
    ],
  };
}

export function parseArtifacts(data: unknown): Artifact[] {
  if (Array.isArray(data)) {
    return data as Artifact[];
  }

  throw new Error("Artifact writer returned invalid artifact data.");
}

export function refreshRunReportArtifact(run: ForgePilotRun) {
  const reportArtifact = run.artifacts.find(
    (artifact) => artifact.fileName === "run-report.json",
  );

  if (!reportArtifact || !run.report) {
    return;
  }

  reportArtifact.content = JSON.stringify(run.report, null, 2);
  reportArtifact.size = `${Math.max(0.1, reportArtifact.content.length / 1024).toFixed(1)} KB`;
}
