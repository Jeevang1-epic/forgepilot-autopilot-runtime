# ForgePilot Architecture Proof

## Runtime Flow

```text
Trigger Engine -> Qwen Planner -> Runtime Executor -> Tool Registry -> Approval Gate -> Artifact Writer -> Flight Recorder
```

## Implemented Foundation

### Trigger Engine

Creates typed runs from manual commands, demo API calls, or validated webhook payloads. Webhook runs preserve safe trigger metadata such as source, trigger name, request ID, and notes.

### Qwen Planner

Server-side adapter that can ask Qwen for structured planner output when env vars are configured. Output is parsed, validated, and repaired when possible. Auto mode falls back locally when configuration is missing or model output is unsafe.

### Runtime Executor

Owns all execution. It records timeline events, tool calls, planner metadata, execution mode metadata, warnings, and fallback behavior.

### Tool Registry

Defines allowed tools with names, descriptions, Zod schemas, risk levels, approval requirements, and local execute functions. The Qwen-facing manifest exposes tool metadata and schemas, not executable functions.

### Approval Gate

Pauses the workflow at `awaiting_approval` before final artifact generation. Rejections stop safely. Duplicate approvals are idempotent.

### Artifact Writer

Creates runtime artifact objects after approval. It currently does not persist generated files to disk, which keeps this MVP local and deterministic.

### Flight Recorder

Builds the inspectable proof trail: timeline, tool calls, approvals, artifacts, final report, selected planner mode, selected execution mode, Qwen status, warnings, and fallback metadata.

## Qwen Tool-Calling Safety

- Qwen can select a next tool only when Qwen env vars are configured.
- ForgePilot validates the selected tool name against the local typed registry.
- ForgePilot validates tool arguments with the local tool schema.
- ForgePilot executes the local registered tool itself.
- `write_markdown_file` is blocked until approval.
- Unknown tools and invalid arguments do not execute.

## Webhook Trigger Proof

`POST /api/webhooks/forgepilot` accepts:

- `goal`
- `source`
- `plannerMode`
- `executionMode`
- `metadata.triggerName`
- `metadata.requestId`
- `metadata.notes`

The route returns a normalized response with run ID, status, trigger type, planner mode used, execution mode used, approval requirement, artifact count, and run URL.

## Health Proof

`GET /api/runs/health` verifies:

- Tool registry completeness.
- Qwen-safe tool manifest.
- Forbidden marker-file absence.
- Approval blocks artifact writing.
- Approval completion.
- Duplicate approval idempotence.
- Rejection safety.
- Auto fallback.
- `qwen_tools` missing-env behavior.
- Webhook endpoint metadata.

## Planned Next

- Optional live n8n workflow template.
- Alibaba Cloud deployment proof path.
- Durable artifact export and storage.
- External connectors only after stronger auth, approval, and audit controls.
