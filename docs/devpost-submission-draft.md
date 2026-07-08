# ForgePilot - Jeevan Autopilot Runtime

Tagline: A local-first Qwen-powered autopilot runtime that turns one builder command or webhook trigger into a validated workflow with tool selection, human approval, generated artifacts, and a Flight Recorder proof trail.

## Inspiration

Solo builders do not need another chat window that only suggests work. During a hackathon, the hard part is turning a messy goal into an actual workflow: plan it, choose tools, stop before risky actions, generate useful artifacts, and preserve proof of what happened.

ForgePilot was inspired by that gap. The goal is an autopilot runtime where the main unit is a run, not a conversation.

## What It Does

ForgePilot starts from a manual command or validated webhook trigger. It creates a typed run, chooses a planner mode, executes registered local tools, pauses at a human approval gate, generates artifacts after approval, and records everything in a Flight Recorder timeline.

The current demo prepares a Qwen Cloud hackathon submission pack. It can produce checklist content, Devpost copy, demo script content, launch-post copy, architecture summary content, and a run report.

## How We Built It

ForgePilot is built with Next.js, TypeScript, Tailwind CSS, and Zod. The runtime model includes runs, plan steps, tool calls, approval requests, artifacts, warnings, and reports.

The architecture is:

```text
Trigger Engine -> Qwen Planner -> Runtime Executor -> Tool Registry -> Approval Gate -> Artifact Writer -> Flight Recorder
```

The app includes a Command Center, Flight Recorder, Trigger Lab, Proof Pack, architecture page, local runtime engine, typed tool registry, approval gate, artifact writer, in-memory run store, normalized API responses, and health checks.

## How We Used Qwen Cloud

ForgePilot includes server-side Qwen adapters for structured planning and tool selection. It also includes JSON normalization, fallback handling, and an OpenAI-compatible tool manifest generated from local registered tools.

When `QWEN_API_KEY`, `QWEN_BASE_URL`, and `QWEN_MODEL` are configured, Qwen can plan or select the next tool. ForgePilot still validates the response locally and executes only registered local tools. If Qwen env vars are missing, auto mode falls back to the deterministic local runtime so the demo remains safe and reproducible.

This repo does not include real Qwen credentials and does not claim a completed production Qwen deployment.

## Challenges

- Designing the project as a runtime rather than a chat UI.
- Keeping model intelligence separate from execution authority.
- Showing useful Qwen integration points without committing secrets.
- Keeping the submission honest without fake external actions or deployment claims.

## Accomplishments

- Built a premium mission-control UI for autopilot runs.
- Implemented a typed local runtime engine.
- Added Qwen planner and tool-selection adapters.
- Added local registry validation for Qwen-selected tools.
- Added an approval gate that blocks final artifact writing.
- Added Trigger Lab and a validated webhook route.
- Added Proof Pack, architecture docs, and deployment checklists.

## What We Learned

The strongest pattern was separating intelligence from authority. Qwen can guide planning or tool selection, but ForgePilot owns validation, local execution, approval, artifact generation, and the proof trail.

That boundary makes the system easier to explain, safer to demo, and closer to a real autopilot runtime.

## What's Next

- Add the live deployment URL to Devpost: https://forgepilot-autopilot-runtime.vercel.app/
- Optionally verify real Qwen env vars with the final account.
- Record and upload the under-3-minute demo video.
- Add an optional live n8n workflow connected to the webhook route.
- Explore Alibaba Function Compute as a documented proof path.
- Add durable artifact export and persistent run history.
- Add real external connectors only after stronger auth, approval, and audit controls.
