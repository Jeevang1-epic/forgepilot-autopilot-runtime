# Screenshot Checklist

Capture these screenshots before the final Devpost submission.

## Product UI

- Home Command Center with headline and command input.
- Run Demo before approval.
- Runtime Brain metadata panel.
- Flight Recorder tool-call cards.
- Approval checkpoint card.
- Artifact Pack after approval.
- Trigger Lab form and payload preview.
- Trigger Lab successful webhook result.
- Submission Proof Pack.
- Architecture page runtime flow.

## API Proof

- `GET /api/qwen/health` response.
- `GET /api/runs/health` response.
- Valid `POST /api/webhooks/forgepilot` response.
- Invalid webhook payload returning `400`.
- Wrong webhook secret returning `401` when configured.

## Repository And Deployment

- GitHub repo README.
- Root `LICENSE`.
- Docs folder.
- Deployment URL home page.
- Deployment URL `/run/demo`.
- Deployment URL `/proof`.

## Safety Proof

- Artifacts absent before approval.
- Artifacts present after approval.
- `qwenConfigured: false` fallback path when no Qwen env vars are set.
- `webhookSecretConfigured: true` when deployed with a secret.
