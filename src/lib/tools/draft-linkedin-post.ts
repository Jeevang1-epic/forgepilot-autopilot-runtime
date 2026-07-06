import { emptyInputSchema } from "@/lib/validation/schemas";
import type { ToolDefinition } from "@/lib/runtime/types";

const linkedinPost = `Building ForgePilot for the Qwen Cloud Global AI Hackathon.

The idea: a local-first autopilot runtime for solo builders.

Not another chatbot. Not just a dashboard.

ForgePilot turns one messy command into a real workflow: trigger, planner, typed tool execution, approval checkpoint, generated artifacts, and a Flight Recorder timeline.

The current build is the local runtime foundation. It uses deterministic local tools today, with Qwen Cloud planner integration planned as the next phase.

The part I care most about: every run leaves proof. Tool calls, approvals, artifacts, and a report are all inspectable after execution.`;

export const draftLinkedInPostTool: ToolDefinition = {
  name: "draft_linkedin_post",
  description: "Drafts a restrained founder-style LinkedIn post.",
  inputSchema: emptyInputSchema,
  riskLevel: "medium",
  requiresApproval: false,
  execute: () => ({
    summary: "Founder-style LinkedIn post drafted for review.",
    data: {
      fileName: "linkedin-post.md",
      content: linkedinPost,
    },
  }),
};
