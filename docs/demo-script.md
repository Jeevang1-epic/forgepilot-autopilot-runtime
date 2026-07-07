# ForgePilot Demo Script

## Goal

Show that ForgePilot is a real local-first autopilot runtime foundation, not a generic chatbot or static dashboard.

## 3-Minute Walkthrough

### 1. Open Command Center

Say:

> ForgePilot starts with a messy builder goal, but the app is built around a runtime, not a chat thread.

Show:

- Headline: "One command. Real workflow. Full proof."
- Command input.
- Trigger selector.
- Runtime stats.
- Recent runs.

### 2. Start A Demo Run

Click `Start Autopilot Run`.

Say:

> The run is created locally. In auto mode, Qwen can be used when env vars are configured; without keys, ForgePilot records a safe local fallback.

### 3. Inspect Flight Recorder

Show:

- Run Overview.
- Runtime Brain metadata.
- Planner mode requested/used.
- Execution mode requested/used.
- Qwen config status.
- Tool manifest count.
- Tool-call cards.

Say:

> Qwen may plan or select tools, but ForgePilot validates selected tools against the local registry and executes only local registered tools.

### 4. Show Approval Gate

Scroll to the approval checkpoint.

Say:

> The workflow pauses before final artifact writing. This is the human-in-the-loop safety boundary.

Click approve.

### 5. Show Artifacts And Report

Show:

- `submission-pack.md`
- `demo-script.md`
- `linkedin-post.md`
- `architecture-summary.md`
- `run-report.json`

Say:

> The final proof is an artifact pack plus a run report, not a disappearing response.

### 6. Show Trigger Lab

Open `/triggers`, send the test webhook, and open the returned run URL.

Say:

> External automation can trigger the same runtime through a validated webhook route. The bridge does not bypass planning, validation, approval, or artifact safety.

### 7. Close On Proof Pack

Open `/proof`.

Say:

> The proof pack separates what is implemented from what is planned next: optional n8n workflow wiring, Alibaba deployment proof, durable export, and real external connectors after stronger safety boundaries.
