# ForgePilot Demo Video Script

Target length: 2:45 to 3:00.

Use either:

- Deployed URL: `TBD_AFTER_DEPLOYMENT`
- Local URL: `http://localhost:3000`

## 0:00 - 0:15 - Open Deployed URL Or Localhost

Click path: open `TBD_AFTER_DEPLOYMENT` or `http://localhost:3000`.

Narration:

> This is ForgePilot, Jeevan Autopilot Runtime. It is a local-first Qwen-powered autopilot runtime for solo builders. It turns one command or webhook trigger into a validated workflow with human approval, artifacts, and proof.

## 0:15 - 0:30 - Show Command Center

Click path: stay on `/`.

Narration:

> This is the Command Center. The command is the trigger surface, but the product is not a chat thread. ForgePilot creates a typed automation run.

Show:

- Hero headline.
- Command input.
- Trigger selector.
- Runtime stats.

## 0:30 - 0:45 - Start Auto Run

Click path:

1. Keep planner mode on `Auto`.
2. Keep execution mode on `Auto`.
3. Click `Start Autopilot Run`.

Narration:

> Auto mode uses Qwen when env vars are configured. Without credentials, ForgePilot records a safe local fallback so the demo remains reproducible without fake keys.

## 0:45 - 1:10 - Show Runtime Brain

Click path: on `/run/demo`, show Runtime Brain.

Narration:

> Runtime Brain shows what was requested and what was actually used. Qwen can plan or select tools, but ForgePilot validates and executes through the local typed registry.

Show:

- Planner requested and used.
- Execution requested and used.
- Qwen config status.
- Tool manifest count.
- Fallback warning if Qwen env vars are missing.

## 1:10 - 1:35 - Show Flight Recorder

Click path: scroll to the Execution Timeline and Tool calls.

Narration:

> The Flight Recorder keeps proof of the run: timeline steps, tool names, risk levels, inputs, outputs, and execution owner.

Show:

- Timeline.
- Tool-call cards.
- Approval requested status.

## 1:35 - 1:50 - Show No Artifacts Before Approval

Click path: inspect Artifact Pack while the run is `awaiting_approval`.

Narration:

> Final artifacts are absent before approval. The runtime blocks final artifact writing until the human checkpoint is approved.

## 1:50 - 2:05 - Approve

Click path: click `Approve Final Artifact Pack`.

Narration:

> This approval is the safety boundary. The operator decides whether ForgePilot can finalize the artifact pack.

## 2:05 - 2:20 - Show Artifacts And Run Report

Click path: inspect Artifact Pack and `View Run Report`.

Narration:

> After approval, artifacts appear: submission pack, demo script, LinkedIn draft, architecture summary, and run report JSON.

## 2:20 - 2:35 - Open Trigger Lab

Click path: open `/triggers`.

Narration:

> ForgePilot can also start from a webhook trigger. Trigger Lab shows the exact payload an n8n or external caller could send.

## 2:35 - 2:45 - Send Test Webhook

Click path:

1. Click `Send Test Webhook`.
2. Open the returned Flight Recorder link.

Narration:

> The webhook creates a run and pauses at approval. It does not bypass validation, local execution, or the approval gate.

## 2:45 - 2:55 - Open Proof Pack

Click path: open `/proof`.

Narration:

> The Proof Pack shows what is implemented now, what is planned next, the safety model, Qwen usage proof, webhook proof, and API checklist.

## 2:55 - 3:00 - End On Architecture Page

Click path: open `/architecture`.

Narration:

> The architecture is trigger, Qwen planner or selector, app-owned tool execution, typed registry, approval gate, artifact writer, and Flight Recorder. Qwen provides intelligence; ForgePilot keeps authority, safety, and proof.
