# Deployed Smoke Test

Deployment URL: `https://forgepilot-autopilot-runtime.vercel.app/`  
GitHub repo: `https://github.com/Jeevang1-epic/forgepilot-autopilot-runtime`

Run this checklist after deploying ForgePilot to Vercel or another Next.js-compatible host.

## Pages

- [ ] `/`
- [ ] `/run/demo`
- [ ] `/triggers`
- [ ] `/proof`
- [ ] `/architecture`

Expected:

- App loads without console-breaking errors.
- Navigation between pages works.
- The dark mission-control UI remains readable.
- The demo run can reach `awaiting_approval`.
- Artifacts are absent before approval and appear after approval.

## APIs

- [ ] `GET /api/qwen/health`
- [ ] `GET /api/runs/health`
- [ ] `POST /api/runs/demo`
- [ ] `POST /api/webhooks/forgepilot` with a valid payload
- [ ] `POST /api/webhooks/forgepilot` with an invalid payload

Expected:

- Qwen health never exposes secrets.
- Missing Qwen env vars fall back safely.
- Demo run pauses at `awaiting_approval`.
- Webhook run pauses at approval.
- Invalid webhook returns `400`.
- If `FORGEPILOT_WEBHOOK_SECRET` is configured, missing or wrong secret returns `401`.

## PowerShell Examples

Set the deployment URL:

```powershell
$baseUrl = "https://forgepilot-autopilot-runtime.vercel.app"
```

Health checks:

```powershell
Invoke-RestMethod -Method GET -Uri "$baseUrl/api/qwen/health"
Invoke-RestMethod -Method GET -Uri "$baseUrl/api/runs/health"
```

Demo run:

```powershell
$demoBody = @{ plannerMode = "auto"; executionMode = "auto" } | ConvertTo-Json
Invoke-RestMethod `
  -Method POST `
  -Uri "$baseUrl/api/runs/demo" `
  -ContentType "application/json" `
  -Body $demoBody
```

Valid webhook:

```powershell
$webhookBody = @{
  goal = "Prepare my Qwen Cloud hackathon submission pack."
  source = "manual_test"
  plannerMode = "auto"
  executionMode = "auto"
  metadata = @{
    triggerName = "Deployed Smoke Test"
    requestId = "deploy-smoke-001"
    notes = "Post-deployment webhook verification."
  }
} | ConvertTo-Json -Depth 5

Invoke-RestMethod `
  -Method POST `
  -Uri "$baseUrl/api/webhooks/forgepilot" `
  -ContentType "application/json" `
  -Body $webhookBody
```

Invalid webhook:

```powershell
try {
  Invoke-RestMethod `
    -Method POST `
    -Uri "$baseUrl/api/webhooks/forgepilot" `
    -ContentType "application/json" `
    -Body '{}'
} catch {
  $_.Exception.Response.StatusCode.value__
  $_.ErrorDetails.Message
}
```

Webhook with secret:

```powershell
Invoke-RestMethod `
  -Method POST `
  -Uri "$baseUrl/api/webhooks/forgepilot" `
  -Headers @{ "x-forgepilot-secret" = "<configured secret>" } `
  -ContentType "application/json" `
  -Body $webhookBody
```

## cURL Examples

Health checks:

```bash
curl https://forgepilot-autopilot-runtime.vercel.app/api/qwen/health
curl https://forgepilot-autopilot-runtime.vercel.app/api/runs/health
```

Demo run:

```bash
curl -X POST https://forgepilot-autopilot-runtime.vercel.app/api/runs/demo \
  -H "Content-Type: application/json" \
  -d "{\"plannerMode\":\"auto\",\"executionMode\":\"auto\"}"
```

Valid webhook:

```bash
curl -X POST https://forgepilot-autopilot-runtime.vercel.app/api/webhooks/forgepilot \
  -H "Content-Type: application/json" \
  -d "{\"goal\":\"Prepare my Qwen Cloud hackathon submission pack.\",\"source\":\"manual_test\",\"plannerMode\":\"auto\",\"executionMode\":\"auto\",\"metadata\":{\"triggerName\":\"Deployed Smoke Test\",\"requestId\":\"deploy-smoke-001\",\"notes\":\"Post-deployment webhook verification.\"}}"
```

Invalid webhook:

```bash
curl -i -X POST https://forgepilot-autopilot-runtime.vercel.app/api/webhooks/forgepilot \
  -H "Content-Type: application/json" \
  -d "{}"
```
