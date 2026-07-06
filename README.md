# ForgePilot - Jeevan Autopilot Runtime

ForgePilot is a local-first autopilot runtime foundation that turns one messy command into a planned workflow, human approval checkpoint, generated artifacts, and a Flight Recorder timeline.

## Current Version

This repo is currently in local runtime MVP state. It includes the premium application shell, command center, Flight Recorder page, architecture proof page, typed local runtime engine, Zod-validated tool registry, approval gate, in-memory run store, generated artifact objects, README, and `.env.example`.

Qwen Cloud is not integrated yet. The live Qwen Cloud planner call is planned for the next phase.

## Hackathon Track

Qwen Cloud Global AI Hackathon, Track 4: Autopilot Agent.

## Core Runtime Flow

Trigger Engine -> Qwen Planner -> Runtime Executor -> Tool Registry -> Approval Gate -> Artifact Writer -> Flight Recorder

ForgePilot is not a generic chatbot. The command input is only the trigger surface. The product foundation is organized around typed runs, tool calls, approvals, local artifacts, and auditable timeline events.

## Foundation Scope

- Premium Next.js App Router interface with a dark mission-control shell.
- Home Command Center with command intake, trigger selector, recent runs, and runtime stats.
- Live Flight Recorder page backed by local API state, timeline events, risk labels, tool names, approval checkpoint UI, tool-call proof cards, report export panel, and artifact panel.
- Architecture proof page explaining what is already built and what is planned next.
- Strong TypeScript runtime types for runs, plan steps, timeline steps, tool calls, approvals, and artifacts.
- Deterministic local tools for the hackathon submission-pack workflow.

## Runtime Engine

The runtime engine is deterministic and local for now. It is designed so Qwen Cloud can control planning in the next phase without changing the rest of the runtime contract.

- `trigger-engine.ts` creates a run and deterministic local plan.
- `tool-registry.ts` registers tools with name, description, input schema, risk level, approval requirement, and execute function.
- `run-engine.ts` executes the plan, records tool calls, pauses at approval, and completes the run after approval.
- `approval-gate.ts` handles approve/reject decisions for the pending action.
- `artifact-writer.ts` creates safe artifact objects in runtime state instead of relying on server filesystem writes.
- `flight-recorder.ts` records timeline steps, tool calls, approvals, artifacts, and run reports.
- `run-store.ts` keeps MVP state in memory, seeded by sample runs as fallback.

The demo workflow pauses at `awaiting_approval` before final artifacts are generated. Approving the checkpoint creates `submission-pack.md`, `demo-script.md`, `linkedin-post.md`, `architecture-summary.md`, and `run-report.json` artifact objects.

## Planned Qwen Cloud Integration

Qwen Cloud is not wired to live API calls yet. The planned integration is:

- Send the normalized run objective to Qwen Cloud.
- Request a structured JSON plan with ordered steps, tool intents, risk levels, and approval requirements.
- Validate the returned plan against ForgePilot runtime types before execution.
- Store planner output in the Flight Recorder so judges can inspect how the plan became a workflow.

## Human Approval Gate

The current local runtime includes an approval checkpoint in the demo recorder. The run pauses before final artifact generation, and the approval API continues or safely stops the run.

## Runtime Artifact Generation

ForgePilot currently simulates safe writes by creating artifact objects in run state, such as:

- `submission-pack.md`
- `demo-script.md`
- `linkedin-post.md`
- `architecture-summary.md`
- `run-report.json`

The goal is to leave builders with useful outputs they can inspect, edit, commit, or submit. Durable persistence can be added later.

## API Routes

- `POST /api/runs` creates a run from `goal` and `triggerType`.
- `GET /api/runs` returns all in-memory runs.
- `POST /api/runs/demo` creates and executes the standard demo run until approval is required.
- `GET /api/runs/[id]` returns a single run.
- `POST /api/approvals` accepts `approvalId` and `decision` (`approved` or `rejected`).

## Local Setup

```bash
npm install
npm run dev
npm run lint
npm run build
```

Open `http://localhost:3000` to view the Command Center.

Demo flow:

1. Click `Start Autopilot Run`.
2. Watch the runtime execute local tools and pause at `awaiting_approval`.
3. Click `Approve artifact write` to generate final artifact objects.
4. Open `Export Run Report` to inspect the JSON report.

## Environment Variables

Copy `.env.example` when wiring live Qwen Cloud credentials later:

```bash
QWEN_API_KEY=
QWEN_BASE_URL=
QWEN_MODEL=
```
