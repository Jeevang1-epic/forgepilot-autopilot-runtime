# ForgePilot - Jeevan Autopilot Runtime

ForgePilot is a local-first autopilot runtime foundation that turns one messy command into a planned workflow, human approval checkpoint, generated artifacts, and a Flight Recorder timeline.

## Current Version

This repo is currently in foundation/demo state with a local runtime MVP plus a Qwen Cloud planner adapter. It includes the premium application shell, command center, Flight Recorder page, architecture proof page, typed local runtime engine, Zod-validated tool registry, approval gate, in-memory run store, generated artifact objects, normalized API routes, README, and `.env.example`.

Qwen Cloud can be used as the planning brain when `QWEN_API_KEY`, `QWEN_BASE_URL`, and `QWEN_MODEL` are configured. Tool execution is still owned by ForgePilot through the local typed tool registry. Full Qwen function-call execution is planned next.

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

The runtime engine remains local-first. Qwen can now control planning when configured, but ForgePilot still validates the plan and executes all tools itself.

- `trigger-engine.ts` creates a run and initial local plan state.
- `src/lib/qwen/*` handles Qwen planner configuration, prompts, response validation, JSON repair, and local fallback.
- `tool-registry.ts` registers tools with name, description, input schema, risk level, approval requirement, and execute function.
- `tool-registry.ts` also exposes planner-safe metadata through `getPlannerToolManifest()` without exposing executable functions.
- `run-engine.ts` executes the plan, records tool calls, pauses at approval, and completes the run after approval.
- `approval-gate.ts` handles approve/reject decisions for the pending action.
- `artifact-writer.ts` creates safe artifact objects in runtime state instead of relying on server filesystem writes.
- `flight-recorder.ts` records timeline steps, tool calls, approvals, artifacts, and run reports.
- `run-store.ts` keeps MVP state in memory, seeded by sample runs as fallback.
- `runtime-smoke-test.ts` verifies the local runtime path used by the health endpoint.

The demo workflow pauses at `awaiting_approval` before final artifacts are generated. Approving the checkpoint creates `submission-pack.md`, `demo-script.md`, `linkedin-post.md`, `architecture-summary.md`, and `run-report.json` artifact objects.

## Runtime Lifecycle

1. Trigger Engine creates a run from a goal and trigger type.
2. The selected planner mode creates plan steps: `local`, `qwen`, or `auto`.
3. Runtime Executor dispatches Zod-validated local tools.
4. Flight Recorder stores timeline and tool-call records.
5. Approval Gate pauses the run at `awaiting_approval`.
6. Approval continues exactly once into artifact generation.
7. Artifact Writer creates runtime artifact objects.
8. Flight Recorder seals the run report after completion.

## Qwen Cloud Planner Setup

Copy `.env.example` to `.env.local` and provide these values when you want to test Qwen planning. Never commit `.env.local` or real secrets.

```bash
QWEN_API_KEY=
QWEN_BASE_URL=
QWEN_MODEL=
```

`QWEN_BASE_URL` should point to the OpenAI-compatible Qwen/Alibaba endpoint. `QWEN_MODEL` should match a model enabled in your Qwen Cloud account. The key is never exposed to client components, health responses, run reports, or planner debug UI.

Planner modes:

- `local`: always use the deterministic built-in planner.
- `qwen`: require Qwen Cloud config and fail cleanly if it is missing.
- `auto`: use Qwen Cloud when all env vars exist, otherwise fall back to the local deterministic planner.

Fallback behavior:

- If Qwen is not configured, `auto` records `local_fallback` and continues safely.
- If Qwen returns fenced JSON or surrounding text, ForgePilot attempts JSON repair and records `qwen_repaired`.
- If Qwen output is still invalid in `auto`, ForgePilot falls back safely to the deterministic local planner.
- If Qwen output is invalid in `qwen`, ForgePilot returns a clean normalized error instead of pretending a plan worked.
- Qwen is the planning brain only. The app executes tools through the typed local registry.

Planned next Qwen work:

- Qwen function-call execution loop.
- Richer planner/tool evaluation traces.
- Stronger artifact export and durable storage.

## Human Approval Gate

The current local runtime includes an approval checkpoint in the demo recorder. The run pauses before final artifact generation, and the approval API continues or safely stops the run.

Repeated approval submissions are safe. If a run is already completed, the runtime returns the completed run without creating duplicate artifacts. If approval is rejected, the run stops safely and does not continue.

## Runtime Artifact Generation

ForgePilot currently simulates safe writes by creating artifact objects in run state, such as:

- `submission-pack.md`
- `demo-script.md`
- `linkedin-post.md`
- `architecture-summary.md`
- `run-report.json`

The goal is to leave builders with useful outputs they can inspect, edit, commit, or submit. Durable persistence can be added later.

## In-Memory Storage Limitation

Runs are stored in an in-memory process store for the MVP. State can reset when the development server or deployment process restarts. This keeps the demo local and deterministic before adding durable storage.

## API Routes

API responses use a consistent shape:

```json
{ "ok": true, "data": {} }
```

```json
{ "ok": false, "error": { "code": "ERROR_CODE", "message": "Readable message" } }
```

- `POST /api/runs` creates a run from `goal` and `triggerType`.
- `GET /api/runs` returns all in-memory runs.
- `POST /api/runs/demo` creates and executes the standard demo run until approval is required.
- `GET /api/runs/[id]` returns a single run.
- `POST /api/approvals` accepts `approvalId` and `decision` (`approved` or `rejected`).
- `GET /api/runs/health` runs a local runtime self-check with safe Qwen status, planner modes, manifest count, demo health, approval health, and artifact health.
- `GET /api/qwen/health` returns safe config booleans: `hasApiKey`, `hasBaseUrl`, `hasModel`, `configured`, and `modelName` only when configured.
- `POST /api/qwen/plan` tests planner output for `goal` and `plannerMode` without exposing raw secrets or executable functions.

## Local Setup

```bash
npm install
npm run dev
npm run lint
npm run build
npm audit --audit-level=moderate
```

Open `http://localhost:3000` to view the Command Center.

Demo flow:

1. Click `Start Autopilot Run`.
2. Watch the runtime execute local tools and pause at `awaiting_approval`.
3. Click `Approve Final Artifact Pack` to generate final artifact objects.
4. Open `View Run Report` to inspect the JSON report.
5. Use `Copy Run Report` if you want the formatted report in your clipboard.

Qwen planner demo flow:

1. Run `npm run dev`.
2. Open `http://localhost:3000/run/demo`.
3. Select `Auto`, `Local`, or `Qwen Cloud` planner mode.
4. Click `Start Fresh Demo Run`.
5. Approve the final artifact pack.
6. Inspect the Planner Brain card and run report.

Runtime health check:

```bash
# with the dev server running
curl http://localhost:3000/api/runs/health
curl http://localhost:3000/api/qwen/health
```

Windows PowerShell:

```powershell
Invoke-RestMethod -Method GET -Uri http://localhost:3000/api/runs/health
Invoke-RestMethod -Method GET -Uri http://localhost:3000/api/qwen/health
```

The health check verifies the tool registry, safe Qwen config status, planner modes, tool manifest count, demo run pause, approval completion, artifact generation, and forbidden marker-file absence.

Planner route local-mode smoke test:

```bash
curl -X POST http://localhost:3000/api/qwen/plan \
  -H "Content-Type: application/json" \
  -d "{\"goal\":\"Prepare my Qwen Cloud hackathon submission pack.\",\"plannerMode\":\"local\"}"
```

Windows PowerShell:

```powershell
Invoke-RestMethod `
  -Method POST `
  -Uri http://localhost:3000/api/qwen/plan `
  -ContentType "application/json" `
  -Body '{"goal":"Prepare my Qwen Cloud hackathon submission pack.","plannerMode":"local"}'
```

Auto fallback smoke test without an API key:

```powershell
Invoke-RestMethod `
  -Method POST `
  -Uri http://localhost:3000/api/qwen/plan `
  -ContentType "application/json" `
  -Body '{"goal":"Prepare my Qwen Cloud hackathon submission pack.","plannerMode":"auto"}'
```

Qwen mode test after configuring `.env.local`:

```powershell
Invoke-RestMethod `
  -Method POST `
  -Uri http://localhost:3000/api/qwen/plan `
  -ContentType "application/json" `
  -Body '{"goal":"Prepare my Qwen Cloud hackathon submission pack.","plannerMode":"qwen"}'
```

Demo run API smoke test:

```powershell
Invoke-RestMethod `
  -Method POST `
  -Uri http://localhost:3000/api/runs/demo `
  -ContentType "application/json" `
  -Body '{"plannerMode":"auto"}'
```
