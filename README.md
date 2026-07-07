# ForgePilot - Jeevan Autopilot Runtime

ForgePilot is a local-first Qwen-powered autopilot runtime for solo builders. It turns one command or webhook trigger into a validated workflow: trigger intake, Qwen-ready planning or tool selection, app-owned local tool execution, human approval, generated artifacts, and a Flight Recorder proof trail.

Status: foundation/demo MVP  
Track: Qwen Cloud Global AI Hackathon, Track 4 - Autopilot Agent  
License: MIT  
One-line pitch: One builder command becomes a real workflow with approval, artifacts, and proof.

ForgePilot is not a generic chatbot. It is not only a dashboard. The command input is the trigger surface; the core product is a typed automation run with tool calls, approvals, artifacts, and inspectable runtime evidence.

## Demo Routes

- `/` - Command Center
- `/run/demo` - Flight Recorder demo
- `/triggers` - Trigger Lab for webhook tests
- `/proof` - Submission Proof Pack
- `/architecture` - Architecture proof
- `/api/qwen/health` - safe Qwen config health
- `/api/runs/health` - runtime health and safety checks
- `/api/webhooks/forgepilot` - validated inbound webhook trigger

## Core Runtime Flow

```text
Trigger Engine -> Qwen Planner -> Runtime Executor -> Tool Registry -> Approval Gate -> Artifact Writer -> Flight Recorder
```

## What Is Implemented

- Premium Next.js App Router interface with a dark mission-control shell.
- Command Center with command intake, trigger selector, recent runs, and runtime stats.
- Flight Recorder with timeline, Runtime Brain metadata, tool-call cards, approval checkpoint, artifact panel, and run report.
- Trigger Lab that sends validated webhook payloads into the runtime.
- Submission Proof Pack and Architecture pages for judges.
- TypeScript runtime model for runs, plan steps, timeline steps, tool calls, approvals, and artifacts.
- Deterministic local planner and typed local tool registry.
- Qwen planner adapter with JSON validation, repair, and local fallback.
- Qwen tool-selection adapter with local registry validation.
- OpenAI-compatible tool manifest generated from local registered tools.
- App-owned execution: ForgePilot executes only registered local tools.
- Human approval gate before final artifact generation.
- Artifact objects after approval.
- Runtime and Qwen health endpoints.
- Optional webhook shared-secret enforcement.

## Qwen Usage

Qwen Cloud can be used as the planning brain or next-tool selector when these server-side environment variables are configured:

```text
QWEN_API_KEY=
QWEN_BASE_URL=
QWEN_MODEL=
```

`QWEN_BASE_URL` should point to an OpenAI-compatible Qwen/Alibaba endpoint. `QWEN_MODEL` should match an enabled Qwen model. The app never commits or exposes real credentials.

Planner modes:

- `local`: deterministic built-in planner.
- `qwen`: require Qwen env vars and fail cleanly when missing.
- `auto`: use Qwen when configured, otherwise fall back locally.

Execution modes:

- `local`: execute the deterministic local runtime plan.
- `qwen_plan`: use Qwen planning when available, then execute locally.
- `qwen_tools`: ask Qwen to select the next tool, validate locally, then execute locally.
- `auto`: use Qwen tool selection when configured, otherwise fall back locally.

## Tool-Calling Safety Model

- Qwen can plan or select tools, but Qwen never executes tools directly.
- ForgePilot validates selected tool names against the typed local registry.
- ForgePilot validates tool arguments with Zod before execution.
- Unknown tools, invalid arguments, unsupported tool-call types, and unsafe selections are blocked or routed to fallback.
- `write_markdown_file` cannot run before an approved human checkpoint.
- Tool-call records include tool name, input summary, output summary, risk level, status, selection source, validation status, and execution owner.

## Webhook Trigger

`POST /api/webhooks/forgepilot` accepts:

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

The route creates a `webhook` run, executes only registered local tools, pauses before artifact writing, and returns a run URL. Missing goals or unknown modes return `400`.

Optional production secret:

```text
FORGEPILOT_WEBHOOK_SECRET=
```

When set, callers must send `x-forgepilot-secret`. Missing or wrong values return `401`. If not set, local demo calls are allowed and `/api/runs/health` reports that production should configure the secret.

## Approval Gate And Artifacts

The demo workflow pauses at `awaiting_approval` before final artifacts exist. Approving the checkpoint creates runtime artifact objects:

- `submission-pack.md`
- `demo-script.md`
- `linkedin-post.md`
- `architecture-summary.md`
- `run-report.json`

Artifacts are MVP runtime objects, not durable exported files yet.

## Local Fallback Behavior

ForgePilot works without Qwen credentials:

- `GET /api/qwen/health` reports `configured: false`.
- Auto planner and execution modes fall back to local deterministic behavior.
- The demo still reaches `awaiting_approval`.
- Artifact writing remains blocked until approval.

With Qwen credentials configured, Qwen can plan or select tools, but local validation and app-owned execution still apply.

## Local Setup

```bash
npm install
npm run dev
npm run lint
npm run build
npm audit --audit-level=moderate
```

Open `http://localhost:3000`.

## Deployment Instructions

Recommended standard deployment path:

1. Push `main` to GitHub.
2. Import the repo into Vercel or another Next.js-compatible host.
3. Use `npm run build`.
4. Add Qwen env vars only when ready for credentialed Qwen testing.
5. Add `FORGEPILOT_WEBHOOK_SECRET` before publicly exposing webhook tests.
6. Smoke test `/`, `/run/demo`, `/triggers`, `/proof`, `/architecture`, `/api/qwen/health`, and `/api/runs/health`.

See:

- `docs/deployment-checklist.md`
- `docs/alibaba-cloud-proof-path.md`

The repo does not claim Alibaba Cloud deployment is complete. The Alibaba proof path is documented as a next deployment step.

## Devpost Judge Demo Steps

1. Open `/`.
2. Keep planner mode on `Auto` and execution mode on `Auto`.
3. Click `Start Autopilot Run`.
4. On `/run/demo`, inspect Runtime Brain metadata.
5. Show Flight Recorder tool-call cards.
6. Confirm artifacts are absent before approval.
7. Approve the final artifact pack.
8. Confirm artifacts appear and open the run report.
9. Open `/triggers` and send a test webhook.
10. Open the returned Flight Recorder run URL.
11. Open `/proof`.
12. Close on `/architecture` and explain the safety boundary: Qwen can guide, ForgePilot validates and executes.

## API Smoke Tests

PowerShell:

```powershell
Invoke-RestMethod -Method GET -Uri http://localhost:3000/api/qwen/health
Invoke-RestMethod -Method GET -Uri http://localhost:3000/api/runs/health
```

Demo run:

```powershell
$body = @{ plannerMode = "auto"; executionMode = "auto" } | ConvertTo-Json
Invoke-RestMethod `
  -Method POST `
  -Uri http://localhost:3000/api/runs/demo `
  -ContentType "application/json" `
  -Body $body
```

Webhook run:

```powershell
$body = @{
  goal = "Prepare my Qwen Cloud hackathon submission pack."
  source = "manual_test"
  plannerMode = "auto"
  executionMode = "auto"
  metadata = @{
    triggerName = "Trigger Lab"
    requestId = "local-test-001"
    notes = "Manual webhook smoke test."
  }
} | ConvertTo-Json -Depth 5

Invoke-RestMethod `
  -Method POST `
  -Uri http://localhost:3000/api/webhooks/forgepilot `
  -ContentType "application/json" `
  -Body $body
```

## Submission Docs

- `docs/devpost-submission-draft.md`
- `docs/demo-script.md`
- `docs/deployment-checklist.md`
- `docs/screenshot-checklist.md`
- `docs/final-submission-checklist.md`
- `docs/alibaba-cloud-proof-path.md`
- `docs/n8n-bridge.md`
- `docs/architecture-proof.md`

## Known MVP Limits

- Runs are stored in memory and reset when the server process restarts.
- Artifact writing currently creates runtime artifact objects, not durable files on disk.
- Approval is local-demo approval, not authenticated multi-user approval.
- Qwen requires real env vars for credentialed model calls; none are committed.
- A live hosted n8n workflow is not included yet.
- Alibaba Cloud deployment proof is documented but not claimed complete.
- No real Gmail, LinkedIn, GitHub, email, posting, deployment, or outbound external automation is implemented.

## Future Roadmap

- Credentialed Qwen Cloud verification with final account settings.
- Optional n8n workflow template connected to the webhook route.
- Alibaba Function Compute deployment proof.
- Durable artifact export and storage.
- Persistent run history.
- Authentication and multi-user approval controls.
- Real external connectors after stronger safety and audit boundaries.
