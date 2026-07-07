# Alibaba Cloud Proof Path

This document explains how ForgePilot can present an Alibaba Cloud proof path without claiming a deployment that has not been completed.

## Current Qwen Cloud Integration Surface

ForgePilot uses Qwen Cloud through OpenAI-compatible API environment variables:

```text
QWEN_API_KEY=
QWEN_BASE_URL=
QWEN_MODEL=
```

When configured, Qwen can produce structured plans or select the next tool. ForgePilot still validates the response locally and executes only registered local tools.

## Qwen Proof File Locations

- `src/lib/qwen/client.ts`
- `src/lib/qwen/planner.ts`
- `src/lib/qwen/tool-calling.ts`
- `src/app/api/qwen/health/route.ts`
- `src/app/api/qwen/plan/route.ts`
- `src/app/api/qwen/tool-call/route.ts`

## Runtime Proof File Locations

- `src/lib/runtime/run-engine.ts`
- `src/lib/runtime/tool-registry.ts`
- `src/lib/runtime/approval-gate.ts`
- `src/app/api/webhooks/forgepilot/route.ts`

## Serverless Deployment Fit

The backend API surface is isolated behind Next.js route handlers. These route handlers behave like serverless HTTP handlers:

- Qwen health check.
- Qwen planner test.
- Qwen tool-selection test.
- Demo run creation.
- Approval decisions.
- Webhook-triggered run creation.

The current repo is build-ready for standard Next.js deployment. It does not claim a completed Alibaba Cloud deployment.

## Optional Alibaba Function Compute Deployment Plan

1. Create an Alibaba Cloud Function Compute web function or HTTP-trigger function.
2. Deploy the Next.js server route surface or a focused HTTP handler wrapper.
3. Add environment variables:
   - `QWEN_API_KEY`
   - `QWEN_BASE_URL`
   - `QWEN_MODEL`
   - `FORGEPILOT_WEBHOOK_SECRET`
4. Expose the Function Compute HTTP trigger.
5. Point n8n or an external trigger to the HTTP endpoint.
6. Keep final approval inside ForgePilot.
7. Capture proof screenshots:
   - Function configuration without exposing secrets.
   - Qwen health response.
   - Webhook request result.
   - Flight Recorder run URL.

## What To Say In Submission

Accurate:

- ForgePilot is built with a Qwen Cloud adapter.
- ForgePilot supports OpenAI-compatible Qwen env vars.
- ForgePilot can fall back locally when Qwen env vars are missing.
- Alibaba Function Compute is a planned proof path.

Avoid:

- Claiming Alibaba Cloud deployment is complete before it is.
- Claiming Qwen executed local tools.
- Claiming real Gmail, LinkedIn, GitHub, or deployment actions are implemented.
