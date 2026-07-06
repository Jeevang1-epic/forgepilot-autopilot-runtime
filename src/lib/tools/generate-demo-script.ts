import { emptyInputSchema } from "@/lib/validation/schemas";
import type { ToolDefinition } from "@/lib/runtime/types";

const demoScript = `# 3-Minute ForgePilot Demo Script

## 0:00 - Opening Hook
One command should be enough to start a real workflow, but the output still needs proof, approvals, and artifacts.

## 0:20 - Problem
Solo builders often lose time turning messy project needs into checklists, drafts, demo scripts, launch posts, and technical proof.

## 0:45 - Live Command
Start the demo run: "Prepare my Qwen Cloud hackathon submission pack for ForgePilot."

## 1:10 - Flight Recorder
Show the timeline moving through trigger intake, deterministic planning, typed tool calls, and generated drafts.

## 1:40 - Approval Checkpoint
Pause at "Finalize and write submission artifact pack" before the runtime creates final artifacts.

## 2:05 - Artifacts
Approve the checkpoint and show generated artifact objects plus the run report.

## 2:35 - Architecture Proof
Open the architecture page and explain Trigger Engine -> Planner -> Runtime Executor -> Tool Registry -> Approval Gate -> Artifact Writer -> Flight Recorder.

## 2:55 - Closing
This is the local runtime foundation. Qwen Cloud planning is the next integration phase.`;

export const generateDemoScriptTool: ToolDefinition = {
  name: "generate_demo_script",
  description: "Generates a concise 3-minute demo script.",
  inputSchema: emptyInputSchema,
  riskLevel: "low",
  requiresApproval: false,
  execute: () => ({
    summary: "Three-minute demo script generated for judge walkthrough.",
    data: {
      fileName: "demo-script.md",
      content: demoScript,
    },
  }),
};
