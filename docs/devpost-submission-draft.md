# ForgePilot Devpost Submission Draft

## Project Name

ForgePilot - Jeevan Autopilot Runtime

## One-Line Pitch

ForgePilot turns one messy builder command into a local-first autopilot run with Qwen-ready planning, safe tool execution, human approval, generated artifacts, and a Flight Recorder timeline.

## Track

Qwen Cloud Global AI Hackathon, Track 4: Autopilot Agent.

## What It Does

ForgePilot is not a chatbot. It is a local-first automation runtime foundation for solo builders:

```text
Trigger Engine -> Qwen Planner -> Runtime Executor -> Tool Registry -> Approval Gate -> Artifact Writer -> Flight Recorder
```

The current MVP can start a run from the Command Center, from the demo API, or from the inbound webhook route. It executes a hackathon submission-pack workflow, pauses before final artifact generation, and records every step in the Flight Recorder.

## Built For This Phase

- Premium Next.js command-center interface.
- Flight Recorder demo with runtime metadata, tool-call cards, approval checkpoint, artifact panel, and run report.
- Qwen planner adapter with structured output validation and local fallback.
- Qwen tool-selection adapter that validates tool calls against the local typed registry.
- Local runtime executor that owns all tool execution.
- Human approval gate before final artifact writing.
- Inbound webhook trigger route with optional shared-secret header.
- Trigger Lab page for local webhook smoke tests.
- Submission Proof Pack page for judges.
- Runtime and Qwen health endpoints.

## Qwen Cloud Plan

ForgePilot has server-side Qwen adapter code for planning and tool selection. When `QWEN_API_KEY`, `QWEN_BASE_URL`, and `QWEN_MODEL` are configured, Qwen can return structured plans or select the next tool. ForgePilot still validates responses locally and executes only registered local tools.

The project does not claim a live production Qwen deployment is already configured in this repo.

## Safety Model

- Qwen does not execute tools directly.
- Only registered local tools can run.
- Tool names and arguments are validated with Zod.
- Unknown or unsafe tool selections are blocked.
- Final artifact writing is blocked before approval.
- Missing Qwen env vars fall back safely in `auto` mode.

## Demo Flow

1. Open the Command Center.
2. Start an autopilot run.
3. Inspect Runtime Brain metadata and tool-call proof.
4. Confirm the run pauses at approval before artifacts exist.
5. Approve the final artifact pack.
6. Inspect generated artifacts and run report.
7. Open Trigger Lab and send a test webhook.
8. Open Submission Proof Pack for the judge-facing summary.

## Planned Next

- Optional live n8n workflow connected to the webhook route.
- Alibaba Function Compute proof path.
- Durable artifact export/download.
- Persistent run storage.
- Real external connectors after stronger auth and approval boundaries.
