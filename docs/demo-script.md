# ForgePilot Demo Video Script

Target length: 2:45 to 3:00.

## 0:00 - 0:15 - Open Command Center

Click path: open `/`.

Narration:

> This is ForgePilot, Jeevan Autopilot Runtime. It is a local-first Qwen-powered autopilot runtime for solo builders. It is not a chatbot and not just a dashboard. The goal is to turn one messy command into a real workflow with proof.

Show:

- Hero headline.
- Command input.
- Trigger selector.
- Runtime stats.

## 0:15 - 0:35 - Explain One Command

Click path: keep the example command visible.

Narration:

> The command here is "Prepare my Qwen Cloud hackathon submission pack." ForgePilot treats this as a runtime trigger. The output is not a message thread. The output is a run with tool calls, an approval gate, artifacts, and a Flight Recorder timeline.

## 0:35 - 0:45 - Select Auto Modes

Click path:

1. Select `Auto` planner.
2. Select `Auto` execution.

Narration:

> Auto mode uses Qwen when Qwen environment variables are configured. Without credentials, it records a safe local fallback so the demo remains reproducible without fake keys.

## 0:45 - 0:55 - Start Autopilot Run

Click path: click `Start Autopilot Run`.

Narration:

> Now ForgePilot creates the run and starts the local execution loop.

## 0:55 - 1:20 - Show Runtime Brain

Click path: on `/run/demo`, scroll to Runtime Brain if needed.

Narration:

> The Runtime Brain shows what was requested and what was actually used. Qwen can plan or select tools when configured, but ForgePilot owns validation and execution. Every selected tool must pass the local typed registry.

Show:

- Planner requested and used.
- Execution requested and used.
- Qwen config status.
- Tool manifest count.
- Fallback warning if Qwen env vars are missing.

## 1:20 - 1:40 - Show Flight Recorder Tool Cards

Click path: scroll to `Tool calls and outputs`.

Narration:

> These are real runtime records. Each card shows the tool name, input summary, output summary, risk level, status, who selected it, and that ForgePilot executed it locally.

Show:

- Project scan.
- Submission checklist.
- Devpost draft.
- Demo script.
- Architecture summary.

## 1:40 - 1:55 - Show Artifacts Absent Before Approval

Click path: look at the Artifact Pack panel while the run is `awaiting_approval`.

Narration:

> Notice that final artifacts are absent before approval. The runtime intentionally blocks `write_markdown_file` until the human checkpoint is approved.

## 1:55 - 2:10 - Approve Checkpoint

Click path: click `Approve Final Artifact Pack`.

Narration:

> This is the human-in-the-loop safety boundary. The operator decides whether the runtime can finalize the artifact pack.

## 2:10 - 2:25 - Show Artifacts Appear

Click path: inspect Artifact Pack and Run Report.

Narration:

> After approval, the artifact pack appears: submission pack, demo script, LinkedIn draft, architecture summary, and run report JSON. The final proof is inspectable artifacts plus the Flight Recorder timeline.

## 2:25 - 2:40 - Open Trigger Lab

Click path:

1. Open `/triggers`.
2. Click `Send Test Webhook`.
3. Open the returned Flight Recorder link.

Narration:

> ForgePilot can also start from a webhook trigger. The Trigger Lab sends the same validated JSON an n8n or external trigger could send. The webhook creates a run, but it does not bypass local validation or approval.

## 2:40 - 2:55 - Open Proof Pack

Click path: open `/proof`.

Narration:

> The Proof Pack summarizes what is implemented and what is planned next. It shows Qwen integration proof, tool-calling safety, webhook proof, approval proof, artifact proof, API endpoints, and the Devpost checklist.

## 2:55 - 3:00 - Close With Architecture

Click path: open `/architecture`.

Narration:

> The architecture is trigger, Qwen planner or selector, app-owned tool execution, typed registry, approval gate, artifact writer, and Flight Recorder. Qwen provides intelligence; ForgePilot keeps authority, safety, and proof.
