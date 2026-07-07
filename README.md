# ForgePilot - Jeevan Autopilot Runtime

ForgePilot is a local-first autopilot runtime foundation that turns one messy command into a planned workflow, human approval checkpoint, generated artifacts, and a Flight Recorder timeline.

## Current Version

This repo is currently in foundation/demo state with a local runtime MVP plus Qwen Cloud planner and tool-selection adapters. It includes the premium application shell, command center, Flight Recorder page, Trigger Lab, architecture proof page, Submission Proof Pack, typed local runtime engine, Zod-validated tool registry, approval gate, inbound webhook route, in-memory run store, generated artifact objects, normalized API routes, README, and `.env.example`.

Qwen Cloud can be used as the planning brain and next-tool selector when `QWEN_API_KEY`, `QWEN_BASE_URL`, and `QWEN_MODEL` are configured. Tool execution is still owned by ForgePilot through the local typed tool registry. Qwen never executes tools directly.

## Hackathon Track

Qwen Cloud Global AI Hackathon, Track 4: Autopilot Agent.

## Core Runtime Flow

Trigger Engine -> Qwen Planner -> Runtime Executor -> Tool Registry -> Approval Gate -> Artifact Writer -> Flight Recorder

ForgePilot is not a generic chatbot. The command input is only the trigger surface. The product foundation is organized around typed runs, tool calls, approvals, local artifacts, and auditable timeline events.

## Foundation Scope

- Premium Next.js App Router interface with a dark mission-control shell.
- Home Command Center with command intake, trigger selector, recent runs, and runtime stats.
- Live Flight Recorder page backed by local API state, timeline events, risk labels, tool names, approval checkpoint UI, tool-call proof cards, report export panel, and artifact panel.
- Trigger Lab page for sending validated local webhook payloads into the runtime.
- Architecture proof page explaining what is already built and what is planned next.
- Submission Proof Pack page with judge-facing implemented/planned proof.
- Strong TypeScript runtime types for runs, plan steps, timeline steps, tool calls, approvals, and artifacts.
- Deterministic local tools for the hackathon submission-pack workflow.

## Runtime Engine

The runtime engine remains local-first. Qwen can now control planning or select the next tool when configured, but ForgePilot still validates every plan and tool call before executing registered local tools itself.

- `trigger-engine.ts` creates a run and initial local plan state.
- `webhook-config.ts` keeps optional inbound webhook secret checks server-side.
- `src/lib/qwen/*` handles Qwen planner/tool-calling configuration, prompts, response validation, JSON repair, local fallback, and the OpenAI-compatible tool manifest.
- `tool-registry.ts` registers tools with name, description, input schema, risk level, approval requirement, and execute function.
- `tool-registry.ts` also exposes planner-safe metadata without exposing executable functions.
- `run-engine.ts` executes the plan, validates Qwen-selected tools against the registry, records tool calls, pauses at approval, and completes the run after approval.
- `approval-gate.ts` handles approve/reject decisions for the pending action.
- `artifact-writer.ts` creates safe artifact objects in runtime state instead of relying on server filesystem writes.
- `flight-recorder.ts` records timeline steps, tool calls, approvals, artifacts, and run reports.
- `run-store.ts` keeps MVP state in memory, seeded by sample runs as fallback.
- `runtime-smoke-test.ts` verifies the local runtime path used by the health endpoint.

The demo workflow pauses at `awaiting_approval` before final artifacts are generated. Approving the checkpoint creates `submission-pack.md`, `demo-script.md`, `linkedin-post.md`, `architecture-summary.md`, and `run-report.json` artifact objects.

## Runtime Lifecycle

1. Trigger Engine creates a run from a goal and trigger type, including manual commands or webhook payloads.
2. The selected planner mode creates plan steps: `local`, `qwen`, or `auto`.
3. The selected execution mode runs local tools directly, uses Qwen planning only, or asks Qwen to select the next tool.
4. Runtime Executor validates every selected tool against the local typed registry.
5. Flight Recorder stores timeline and tool-call records.
6. Approval Gate pauses the run at `awaiting_approval`.
7. Approval continues exactly once into artifact generation.
8. Artifact Writer creates runtime artifact objects.
9. Flight Recorder seals the run report after completion.

## Demo Path For Judges

1. Run `npm install` and `npm run dev`.
2. Open `http://localhost:3000`.
3. Keep Planner mode on `Auto` and Execution mode on `Auto`.
4. Click `Start Autopilot Run`.
5. On `/run/demo`, inspect `Runtime Brain`, `Judge Demo Checklist`, `Execution Timeline`, and `Tool calls and outputs`.
6. Confirm the run pauses at `awaiting_approval` before artifacts exist.
7. Click `Approve Final Artifact Pack`.
8. Confirm artifacts appear and `View Run Report` includes planner, execution, fallback, approval, and artifact metadata.

This path works without a Qwen API key. Missing env vars do not break the demo because `auto` mode falls back to local runtime execution.

## Webhook Trigger Bridge

`POST /api/webhooks/forgepilot` accepts safe JSON trigger payloads from the Trigger Lab, n8n, or another external caller:

```json
{
  "goal": "Prepare my Qwen Cloud hackathon submission pack.",
  "source": "manual_test",
  "plannerMode": "auto",
  "executionMode": "auto",
  "metadata": {
    "triggerName": "Trigger Lab",
    "requestId": "local-test-001",
    "notes": "Manual webhook smoke test."
  }
}
```

The route validates the payload with Zod, creates a run with `triggerType: "webhook"`, executes only registered local tools, pauses before final artifact writing, and returns normalized run metadata:

```json
{
  "ok": true,
  "data": {
    "runId": "run-...",
    "status": "awaiting_approval",
    "triggerType": "webhook",
    "plannerModeUsed": "local_fallback",
    "executionModeUsed": "local_fallback",
    "approvalRequired": true,
    "artifactsCount": 0,
    "runUrl": "/run/demo?runId=run-..."
  }
}
```

Missing `goal` or unknown modes return a clean `400`. If `FORGEPILOT_WEBHOOK_SECRET` is set, callers must include `x-forgepilot-secret`; missing or wrong values return a clean `401`. If the secret is not set, local demo calls are allowed, and `/api/runs/health` reports that production should configure the secret.

PowerShell webhook smoke test:

```powershell
Invoke-RestMethod `
  -Method POST `
  -Uri http://localhost:3000/api/webhooks/forgepilot `
  -ContentType "application/json" `
  -Body '{"goal":"Prepare my Qwen Cloud hackathon submission pack.","source":"manual_test","plannerMode":"auto","executionMode":"auto","metadata":{"triggerName":"Trigger Lab","requestId":"local-test-001","notes":"Manual webhook smoke test."}}'
```

cURL webhook smoke test:

```bash
curl -X POST http://localhost:3000/api/webhooks/forgepilot \
  -H "Content-Type: application/json" \
  -d "{\"goal\":\"Prepare my Qwen Cloud hackathon submission pack.\",\"source\":\"manual_test\",\"plannerMode\":\"auto\",\"executionMode\":\"auto\",\"metadata\":{\"triggerName\":\"Trigger Lab\",\"requestId\":\"local-test-001\",\"notes\":\"Manual webhook smoke test.\"}}"
```

Optional n8n bridge path:

1. Add an n8n Webhook trigger.
2. Add an HTTP Request node that POSTs the JSON payload to `/api/webhooks/forgepilot`.
3. Add `x-forgepilot-secret` only when `FORGEPILOT_WEBHOOK_SECRET` is configured.
4. Store `data.runId` and open `data.runUrl` to inspect the Flight Recorder proof.

This repo does not claim that a live hosted n8n workflow is already deployed.

## Qwen Cloud Runtime Setup

Copy `.env.example` to `.env.local` and provide these values when you want to test Qwen planning. Never commit `.env.local` or real secrets.

```bash
QWEN_API_KEY=
QWEN_BASE_URL=
QWEN_MODEL=
FORGEPILOT_WEBHOOK_SECRET=
```

`QWEN_BASE_URL` should point to the OpenAI-compatible Qwen/Alibaba endpoint. `QWEN_MODEL` should match a model enabled in your Qwen Cloud account. The key is never exposed to client components, health responses, run reports, or planner debug UI.

Planner modes:

- `local`: always use the deterministic built-in planner.
- `qwen`: require Qwen Cloud config and fail cleanly if it is missing.
- `auto`: use Qwen Cloud when all env vars exist, otherwise fall back to the local deterministic planner.

Execution modes:

- `local`: execute the deterministic local runtime plan.
- `qwen_plan`: use Qwen for planning when available, then execute locally.
- `qwen_tools`: ask Qwen to select the next tool, validate the selection locally, then execute only registered local tools.
- `auto`: use Qwen tool selection when configured, otherwise fall back to local runtime execution.

## Tool-Calling Safety Model

- Qwen may create a plan or select the next tool only when Qwen env vars are configured.
- Qwen never executes tools directly.
- ForgePilot validates selected tool names against the typed local registry.
- ForgePilot validates tool arguments with Zod before execution.
- Unknown tools, invalid JSON arguments, unsupported tool-call types, and unsafe selections are blocked.
- `write_markdown_file` cannot run before an approved human checkpoint.
- Tool calls record who selected them, who validated them, who executed them, risk level, approval requirement, input summary, and output summary.
- Run reports include `plannerModeRequested`, `plannerModeUsed`, `executionModeRequested`, `executionModeUsed`, `qwenConfigured`, `qwenModel`, `qwenToolCallingAvailable`, `qwenToolCallingUsed`, `qwenToolCallWarnings`, `toolManifestCount`, `selectedToolsCount`, `locallyCompletedToolsCount`, `blockedUnsafeToolCallsCount`, and `maxToolLoopHit`.

## Fallback Behavior

- If Qwen is not configured, `auto` records `local_fallback` and continues safely.
- If `qwen_tools` is requested through the demo runtime without env vars, ForgePilot records a safe local fallback so the judge demo continues.
- If `qwen_tools` is requested through `/api/qwen/tool-call` without env vars and fallback is not allowed, the route returns a normalized `QWEN_NOT_CONFIGURED` error.
- Direct tool-call tests can set `allowFallback: true` or use `executionMode: "auto"` to verify fallback behavior without a Qwen API key.
- If Qwen returns fenced JSON or surrounding text, ForgePilot attempts JSON repair and records `qwen_repaired`.
- If Qwen output is still invalid in `auto`, ForgePilot falls back safely to the deterministic local planner.
- If Qwen output is invalid in `qwen`, ForgePilot returns a clean normalized error instead of pretending a plan worked.
- Qwen can plan or select tools. The app executes tools through the typed local registry.
- `write_markdown_file` remains blocked before approval, even if Qwen selects it.

Planned next Qwen work:

- Real credential testing against the final Qwen/Alibaba Cloud account.
- Richer planner/tool evaluation traces.
- Stronger artifact export and durable storage.

## Known MVP Limits

- Runs are stored in memory and reset when the server process restarts.
- Artifact writing currently creates runtime artifact objects, not durable files on disk.
- Approval is local-demo approval, not authenticated multi-user approval.
- The webhook route and Trigger Lab are implemented; a live hosted n8n workflow template remains planned.
- No Alibaba Cloud deployment proof is implemented yet.
- No real Gmail, LinkedIn, GitHub, email, posting, deployment, or outbound external automation is implemented.

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
- `POST /api/webhooks/forgepilot` accepts a validated inbound trigger payload and creates a webhook-triggered run that pauses at approval.
- `GET /api/runs/health` runs a local runtime self-check with safe Qwen status, webhook status, planner modes, execution modes, manifest count, demo health, approval health, and artifact health.
- `GET /api/qwen/health` returns safe config booleans: `hasApiKey`, `hasBaseUrl`, `hasModel`, `configured`, and `modelName` only when configured.
- `POST /api/qwen/plan` tests planner output for `goal` and `plannerMode` without exposing raw secrets or executable functions.
- `POST /api/qwen/tool-call` tests Qwen tool selection and local registry validation without executing the selected tool.

## Local Setup

```bash
npm install
npm run dev
npm run lint
npm run build
npm audit --audit-level=moderate
```

Open `http://localhost:3000` to view the Command Center. Use `http://localhost:3000/triggers` for Trigger Lab and `http://localhost:3000/proof` for the Submission Proof Pack.

Demo flow:

1. Click `Start Autopilot Run`.
2. Watch the runtime execute local tools and pause at `awaiting_approval`.
3. Click `Approve Final Artifact Pack` to generate final artifact objects.
4. Open `View Run Report` to inspect the JSON report.
5. Use `Copy Run Report` if you want the formatted report in your clipboard.

Qwen runtime demo flow:

1. Run `npm run dev`.
2. Open `http://localhost:3000/run/demo`.
3. Select a planner mode and execution mode.
4. Click `Start Fresh Demo Run`.
5. Approve the final artifact pack.
6. Inspect the Runtime Brain card, tool-call cards, and run report.

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

The health check verifies the tool registry, safe Qwen config status, webhook status, planner modes, execution modes, tool manifest counts, demo run pause, approval blocking, approval completion, duplicate approval idempotence, rejected approval safety, auto fallback, qwen_tools missing-env behavior, artifact generation, and forbidden marker-file absence.

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

## How To Test Without Qwen API Key

Use `auto` mode for the judge demo path. It should fall back locally and still pause before artifact generation.

Demo run API smoke test:

```powershell
$demo = Invoke-RestMethod `
  -Method POST `
  -Uri http://localhost:3000/api/runs/demo `
  -ContentType "application/json" `
  -Body '{"plannerMode":"auto","executionMode":"auto"}'

$demo.data.run.status
$demo.data.run.executionModeUsed
$demo.data.run.qwenToolCallWarnings
```

Tool-call fallback smoke test without a Qwen key:

```powershell
Invoke-RestMethod `
  -Method POST `
  -Uri http://localhost:3000/api/qwen/tool-call `
  -ContentType "application/json" `
  -Body '{"goal":"Prepare my Qwen Cloud hackathon submission pack.","executionMode":"auto","context":{"completedTools":[]}}'
```

Direct `qwen_tools` without fallback should return a normalized `QWEN_NOT_CONFIGURED` error when env vars are missing:

```powershell
try {
  Invoke-RestMethod `
    -Method POST `
    -Uri http://localhost:3000/api/qwen/tool-call `
    -ContentType "application/json" `
    -Body '{"goal":"Prepare my Qwen Cloud hackathon submission pack.","executionMode":"qwen_tools","context":{"completedTools":[]}}'
} catch {
  $_.ErrorDetails.Message
}
```

Approval flow smoke test:

```powershell
$demo = Invoke-RestMethod `
  -Method POST `
  -Uri http://localhost:3000/api/runs/demo `
  -ContentType "application/json" `
  -Body '{"plannerMode":"auto","executionMode":"auto"}'

$approvalId = $demo.data.run.approvalRequests[0].id

$approved = Invoke-RestMethod `
  -Method POST `
  -Uri http://localhost:3000/api/approvals `
  -ContentType "application/json" `
  -Body (@{ approvalId = $approvalId; decision = "approved" } | ConvertTo-Json)

$approved.data.run.status
$approved.data.run.artifacts.Count
```

## How To Test With Qwen API Key

After setting `.env.local`, restart `npm run dev` so Next.js loads the env vars.

```powershell
Invoke-RestMethod `
  -Method GET `
  -Uri http://localhost:3000/api/qwen/health
```

```powershell
Invoke-RestMethod `
  -Method POST `
  -Uri http://localhost:3000/api/qwen/tool-call `
  -ContentType "application/json" `
  -Body '{"goal":"Prepare my Qwen Cloud hackathon submission pack.","executionMode":"qwen_tools","context":{"completedTools":[]}}'
```

The route should return a selected tool call only after Qwen responds. The route does not execute that tool; ForgePilot execution still happens through the runtime.
