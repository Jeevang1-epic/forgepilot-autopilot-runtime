# Final Submission Checklist

Status markers:

- Done: completed in the repo.
- Needs user action: must be completed outside this repo before Devpost.
- Optional: useful but not required for the current foundation/demo submission.

## Repository

- Done - Public GitHub repo: `https://github.com/Jeevang1-epic/forgepilot-autopilot-runtime`
- Done - MIT `LICENSE` visible at repo root.
- Done - README is submission-ready and accurate.
- Done - `.env.example` contains placeholders only.
- Done - `.env.local` is not tracked.
- Done - No real secrets are committed.
- Done - Forbidden marker files are absent:
  - `CLAUDE.md`
  - `AGENTS.md`
  - `.cursor/rules`
  - `.windsurfrules`
  - `.agents`

## Demo And Deployment

- Done - Deploy publicly: `https://forgepilot-autopilot-runtime.vercel.app/`
- Needs user action - Add deployment URL to Devpost.
- Done - Replace deployment placeholder in repo docs.
- Done - `/` loads the Command Center locally.
- Done - `/run/demo` loads the Flight Recorder locally.
- Done - `/triggers` loads Trigger Lab locally.
- Done - `/proof` loads Submission Proof Pack locally.
- Done - `/architecture` loads architecture proof locally.
- Done - `GET /api/qwen/health` returns normalized JSON.
- Done - `GET /api/runs/health` returns normalized JSON.
- Done - `POST /api/webhooks/forgepilot` accepts a valid sample payload.
- Done - Invalid webhook payload returns `400`.
- Optional - Wrong webhook secret returns `401` when a secret is configured.

## Qwen And Runtime Proof

- Optional - Real Qwen env test with `QWEN_API_KEY`, `QWEN_BASE_URL`, and `QWEN_MODEL`.
- Done - Fallback behavior is documented and tested when Qwen env vars are missing.
- Done - Qwen never executes tools directly.
- Done - Local registry validation is shown.
- Done - Approval gate is shown before artifact generation.
- Done - Artifacts appear after approval.
- Done - Flight Recorder run report is visible.

## Devpost Materials

- Done - Track 4: Autopilot Agent is named.
- Done - Devpost copy is paste-ready in `docs/devpost-submission-draft.md`.
- Needs user action - Record demo video.
- Needs user action - Upload demo video.
- Needs user action - Paste Devpost copy.
- Needs user action - Submit.
- Done - Architecture page is ready.
- Done - Proof Pack route is ready.
- Needs user action - Add deployment URL to Devpost.
- Done - GitHub URL is ready.

## Quality Gates

- Done - `npm run lint` passes.
- Done - `npm run build` passes.
- Done - `npm audit --audit-level=moderate` passes.
