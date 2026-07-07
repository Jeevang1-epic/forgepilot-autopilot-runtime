# n8n Bridge Guide

ForgePilot now exposes a safe inbound webhook route that can be called from n8n:

```text
POST /api/webhooks/forgepilot
```

The bridge creates a ForgePilot run with `triggerType: "webhook"` and then lets the local runtime handle planner selection, tool execution, approval, artifact generation, and Flight Recorder proof. n8n starts the run; it does not execute ForgePilot tools.

## Payload

Use `docs/webhook-payload.example.json` as the baseline request body:

```json
{
  "goal": "Prepare my Qwen Cloud hackathon submission pack.",
  "source": "n8n",
  "plannerMode": "auto",
  "executionMode": "auto",
  "metadata": {
    "triggerName": "Qwen Hackathon Submission Pack",
    "requestId": "n8n-demo-001",
    "notes": "Local n8n bridge smoke test."
  }
}
```

Supported values:

- `source`: `manual_test`, `n8n`, or `external`
- `plannerMode`: `local`, `qwen`, or `auto`
- `executionMode`: `local`, `qwen_plan`, `qwen_tools`, or `auto`

## Optional Secret

If `FORGEPILOT_WEBHOOK_SECRET` is set in the ForgePilot server environment, n8n must send:

```text
x-forgepilot-secret: <configured secret>
```

Missing or incorrect secrets return `401`. If the secret is not configured, local demo calls are allowed, and `/api/runs/health` reports `webhookSecretConfigured: false`.

Do not commit real webhook secrets.

## n8n Workflow Outline

1. Add an n8n Webhook trigger node with POST JSON input.
2. Add an HTTP Request node.
3. Set method to `POST`.
4. Set URL to the ForgePilot webhook endpoint.
5. Add `Content-Type: application/json`.
6. Add `x-forgepilot-secret` only when configured.
7. Send the payload fields listed above.
8. Save `data.runId` and `data.runUrl` from the response.
9. Open `data.runUrl` in ForgePilot to show the Flight Recorder proof.

## Safety Boundary

- Qwen can plan or select tools only when configured.
- ForgePilot validates every selected tool against the typed local registry.
- ForgePilot executes only registered local tools.
- `write_markdown_file` remains blocked until a human approval checkpoint is approved.
- The current repo does not claim a live hosted n8n workflow is already deployed.
