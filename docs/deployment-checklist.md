# ForgePilot Deployment Checklist

Use this checklist before sharing ForgePilot publicly or submitting the Devpost entry.

Deployment URL: `TBD_AFTER_DEPLOYMENT`  
GitHub repo: `https://github.com/Jeevang1-epic/forgepilot-autopilot-runtime`

## Local Setup

```bash
npm install
npm run dev
npm run lint
npm run build
npm audit --audit-level=moderate
```

Open `http://localhost:3000` and run the full judge path before deploying.

## Environment Variables

ForgePilot works without Qwen credentials in `auto` mode by falling back to the local deterministic runtime.

Required only for Qwen-backed tests:

```text
QWEN_API_KEY=
QWEN_BASE_URL=
QWEN_MODEL=
```

Optional but recommended for public webhook deployments:

```text
FORGEPILOT_WEBHOOK_SECRET=
```

Optional public app URL placeholder:

```text
NEXT_PUBLIC_APP_URL=
```

The app does not require `NEXT_PUBLIC_APP_URL` to run.

Do not commit `.env.local` or real secrets.

## Vercel Deployment Steps

1. Push the latest `main` branch to GitHub.
2. Import `Jeevang1-epic/forgepilot-autopilot-runtime` into Vercel.
3. Keep the default Next.js build command: `npm run build`.
4. Add Qwen environment variables only if credentialed Qwen testing is ready.
5. Add `FORGEPILOT_WEBHOOK_SECRET` before exposing webhook tests publicly.
6. Deploy.
7. Replace `TBD_AFTER_DEPLOYMENT` in submission materials only after a real deployment exists.
8. Smoke test the routes listed below on the deployment URL.

## Qwen Environment Setup

1. Confirm the Qwen/Alibaba account has an OpenAI-compatible endpoint enabled.
2. Set `QWEN_BASE_URL` to that OpenAI-compatible endpoint.
3. Set `QWEN_MODEL` to an enabled Qwen model name.
4. Set `QWEN_API_KEY` only in the deployment provider or local `.env.local`.
5. Restart or redeploy so Next.js route handlers receive the env vars.
6. Verify `GET /api/qwen/health` reports `configured: true`.

## Webhook Secret Setup

1. Generate a strong shared secret outside the repo.
2. Set `FORGEPILOT_WEBHOOK_SECRET` in Vercel or the deployment environment.
3. Send the secret as `x-forgepilot-secret`.
4. Confirm missing or wrong secrets return `401`.
5. Confirm a valid secret returns a webhook run that pauses at approval.

## Routes To Smoke Test

- `/`
- `/run/demo`
- `/triggers`
- `/proof`
- `/architecture`
- `/api/qwen/health`
- `/api/runs/health`
- `/api/webhooks/forgepilot`

Detailed deployed checks live in `docs/deployed-smoke-test.md`.

## Expected Behavior Without Qwen Env

- `GET /api/qwen/health` reports `configured: false`.
- `GET /api/runs/health` reports Qwen unavailable and local fallback ready.
- Demo runs in `auto` mode still reach `awaiting_approval`.
- `qwen_tools` mode records safe local fallback instead of crashing.
- Artifact objects remain absent until approval is granted.

## Expected Behavior With Qwen Env

- `GET /api/qwen/health` reports `configured: true`.
- Planner or tool-selection calls can use Qwen.
- ForgePilot still validates plans and tool selections locally.
- ForgePilot still executes only registered local tools.
- Artifact writing still requires approval.

## Screenshots To Capture

- Home Command Center.
- Flight Recorder before approval.
- Runtime Brain metadata.
- Tool-call proof cards.
- Approval checkpoint.
- Artifact panel after approval.
- Trigger Lab payload and result.
- Proof Pack.
- Architecture page.
- Health endpoint JSON.
- GitHub README.
- Deployment URL.
