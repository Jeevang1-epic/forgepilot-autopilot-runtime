# ForgePilot - Jeevan Autopilot Runtime

## Tagline

A local-first Qwen-powered autopilot runtime that turns one builder command or webhook trigger into a validated workflow with tool selection, human approval, generated artifacts, and a Flight Recorder proof trail.

## Inspiration

Solo builders do not need another chat window that only suggests work. During a hackathon, the hard part is turning a messy goal into a real workflow: plan the work, call the right tools, stop before risky actions, generate useful artifacts, and preserve proof of what happened.

ForgePilot was built around that gap. The goal is an autopilot runtime for builders, where the main unit is a run, not a conversation.

## What It Does

ForgePilot starts from either a manual command or a validated webhook trigger. It creates a typed run, chooses a planner mode, executes registered local tools, pauses at a human approval gate, generates artifacts after approval, and records everything in a Flight Recorder timeline.

The current demo workflow prepares a Qwen Cloud hackathon submission pack. It can generate checklist content, Devpost copy, demo script content, launch-post copy, architecture summary content, and a run report.

## How It Works

Runtime flow:

```text
Trigger Engine -> Qwen Planner -> Runtime Executor -> Tool Registry -> Approval Gate -> Artifact Writer -> Flight Recorder
```

The runtime keeps state as typed objects: runs, plan steps, tool calls, approval requests, artifacts, and reports. API responses are normalized, and the UI exposes the run as operational proof rather than a chat transcript.

## How We Used Qwen Cloud

ForgePilot includes server-side Qwen adapters for:

- Structured planning.
- JSON normalization and repair.
- Tool-selection requests.
- OpenAI-compatible tool manifest generation.
- Local validation of Qwen-selected tools.

When `QWEN_API_KEY`, `QWEN_BASE_URL`, and `QWEN_MODEL` are configured, Qwen can provide plans or select the next tool. ForgePilot still validates the response locally and executes only registered local tools. When Qwen env vars are missing, `auto` mode falls back to the deterministic local runtime so the demo remains safe and reproducible.

This repo does not include real Qwen credentials and does not claim a completed production Qwen deployment.

## Track Fit: Autopilot Agent

ForgePilot fits Track 4 because it demonstrates an automation runtime loop:

- Manual or webhook trigger.
- Planner/tool selector.
- App-owned tool execution.
- Human approval checkpoint.
- Artifact generation.
- Flight Recorder proof.

It is not positioned as a generic chatbot or a static dashboard.

## Technical Architecture

- Next.js App Router frontend and API routes.
- TypeScript runtime model.
- Zod-validated request bodies and tool inputs.
- In-memory MVP run store.
- Local typed tool registry.
- Approval gate before artifact writing.
- Qwen planner and tool-selection adapters.
- Webhook trigger route with optional shared-secret header.
- Health endpoints for runtime and Qwen configuration proof.

## Human-In-The-Loop Safety

ForgePilot blocks final artifact writing until a human approves the checkpoint. Qwen never executes tools directly. Unknown tool names, invalid tool arguments, unsupported tool-call types, and unsafe artifact-writing attempts are blocked or routed to safe local fallback behavior.

## Challenges

- Designing the project as a runtime rather than a chat UI.
- Making Qwen integration useful while keeping execution owned by the app.
- Keeping the demo honest without fake keys, fake deployment claims, or simulated external actions.
- Showing enough proof for judges while keeping the MVP local-first and understandable.

## Accomplishments

- Built a premium mission-control UI for autopilot runs.
- Implemented a typed local runtime engine.
- Added Qwen planner and tool-selection adapters.
- Added local registry validation for Qwen-selected tools.
- Added a Flight Recorder with timeline, tool-call, approval, artifact, and report proof.
- Added Trigger Lab and a validated webhook route.
- Added Proof Pack and architecture pages for judges.
- Kept fallback behavior safe when Qwen env vars are missing.

## What We Learned

The most important design decision was separating intelligence from authority. Qwen can plan or select, but ForgePilot owns validation, execution, approval, artifact generation, and reporting. That makes the system easier to explain, safer to demo, and closer to a real autopilot runtime.

## What Is Next

- Credentialed Qwen Cloud testing with the final account.
- Optional n8n workflow connected to the webhook route.
- Alibaba Function Compute proof path.
- Durable artifact export and storage.
- Persistent run history.
- Real external connectors only after stronger authentication, approval, and audit controls.

## Built With

- Next.js
- TypeScript
- Tailwind CSS
- Zod
- Qwen Cloud OpenAI-compatible API adapter
- Local-first runtime architecture
