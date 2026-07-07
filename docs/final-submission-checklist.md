# Final Submission Checklist

Use this list before clicking submit on Devpost.

## Repository

- Public GitHub repo is available.
- `LICENSE` is visible at the repo root.
- README is complete and accurate.
- No real secrets are committed.
- `.env.local` is not committed.
- `.env.example` contains placeholders only.
- Forbidden marker files are absent:
  - `CLAUDE.md`
  - `AGENTS.md`
  - `.cursor/rules`
  - `.windsurfrules`
  - `.agents`

## Demo And Deployment

- Deployment URL is live.
- `/` loads the Command Center.
- `/run/demo` loads the Flight Recorder.
- `/triggers` loads Trigger Lab.
- `/proof` loads Submission Proof Pack.
- `/architecture` loads architecture proof.
- `GET /api/qwen/health` returns normalized JSON.
- `GET /api/runs/health` returns normalized JSON.
- `POST /api/webhooks/forgepilot` accepts a valid sample payload.
- Invalid webhook payload returns `400`.
- Wrong webhook secret returns `401` when a secret is configured.

## Qwen And Runtime Proof

- Qwen env tested if credentials are available, or fallback behavior is explained.
- Qwen never executes tools directly.
- Local registry validation is shown.
- Approval gate is shown before artifact generation.
- Artifacts appear after approval.
- Flight Recorder run report is visible.

## Devpost Materials

- Track 4: Autopilot Agent is selected.
- Devpost text is ready.
- Demo video is under 3 minutes.
- Architecture page or diagram is included.
- Proof Pack route is included.
- Deployment URL is included.
- GitHub URL is included.

## Quality Gates

- `npm run lint` passes.
- `npm run build` passes.
- `npm audit --audit-level=moderate` passes.
