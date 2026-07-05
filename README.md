# ForgePilot - Jeevan Autopilot Runtime

ForgePilot is a local-first autopilot runtime foundation that turns one messy command into a planned workflow, human approval checkpoint, generated artifacts, and a Flight Recorder timeline.

## Hackathon Track

Qwen Cloud Global AI Hackathon, Track 4: Autopilot Agent.

## Core Runtime Flow

Trigger Engine -> Qwen Planner -> Runtime Executor -> Tool Registry -> Approval Gate -> Artifact Writer -> Flight Recorder

ForgePilot is not a generic chatbot. The command input is only the trigger surface. The product foundation is organized around typed runs, tool calls, approvals, local artifacts, and auditable timeline events.

## MVP Scope

- Premium Next.js App Router interface with a dark mission-control shell.
- Home Command Center with command intake, trigger selector, seeded recent runs, and runtime stats.
- Live Flight Recorder demo page with timeline events, risk labels, tool names, approval preview, and artifact panel.
- Architecture proof page explaining the runtime flow and judge-facing differentiators.
- Strong TypeScript runtime types for runs, timeline steps, tool calls, approvals, and artifacts.
- Seeded mock data for a hackathon submission-pack workflow.

## Planned Qwen Cloud Integration

Qwen Cloud is not wired to live API calls yet. The planned integration is:

- Send the normalized run objective to Qwen Cloud.
- Request a structured JSON plan with ordered steps, tool intents, risk levels, and approval requirements.
- Validate the returned plan against ForgePilot runtime types before execution.
- Store planner output in the Flight Recorder so judges can inspect how the plan became a workflow.

## Planned Human Approval Gate

The approval gate will pause high-impact actions before they run, including public-facing claims, file writes, deployments, outbound webhooks, and other actions that need explicit human control.

## Planned Artifact Generation

ForgePilot will write reviewed outputs to local artifact paths, such as:

- `submission-pack.md`
- `demo-script.md`
- `linkedin-post.md`
- `architecture-summary.md`
- `run-report.json`

The goal is to leave builders with useful files they can inspect, edit, commit, or submit.

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000` to view the Command Center.

Useful checks:

```bash
npm run lint
npm run build
```

## Environment Variables

Copy `.env.example` when wiring live Qwen Cloud credentials later:

```bash
QWEN_API_KEY=
QWEN_BASE_URL=
QWEN_MODEL=
```
