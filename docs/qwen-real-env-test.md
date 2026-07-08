# Qwen Real Environment Verification

Use this guide only when real Qwen Cloud credentials are available. Do not commit real values.

## Create `.env.local`

Create a local `.env.local` file:

```text
QWEN_API_KEY=
QWEN_BASE_URL=
QWEN_MODEL=
```

Optional for webhook tests:

```text
FORGEPILOT_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=
```

`.env.local` is ignored by git and must stay uncommitted.

## Required Values

- `QWEN_API_KEY`: real Qwen/Alibaba API key.
- `QWEN_BASE_URL`: OpenAI-compatible Qwen endpoint.
- `QWEN_MODEL`: enabled model name.

## Start The App

```bash
npm install
npm run dev
```

Restart the dev server after changing `.env.local`.

## Test Qwen Health

PowerShell:

```powershell
Invoke-RestMethod -Method GET -Uri http://localhost:3000/api/qwen/health
```

cURL:

```bash
curl http://localhost:3000/api/qwen/health
```

Success:

- `configured` is `true`.
- `modelName` is present.
- API key value is not returned.

Fallback:

- `configured` is `false`.
- Missing fields are represented as booleans only.
- No secret values are exposed.

## Test Qwen Planner

PowerShell:

```powershell
$body = @{
  goal = "Prepare my Qwen Cloud hackathon submission pack."
  plannerMode = "qwen"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method POST `
  -Uri http://localhost:3000/api/qwen/plan `
  -ContentType "application/json" `
  -Body $body
```

cURL:

```bash
curl -X POST http://localhost:3000/api/qwen/plan \
  -H "Content-Type: application/json" \
  -d "{\"goal\":\"Prepare my Qwen Cloud hackathon submission pack.\",\"plannerMode\":\"qwen\"}"
```

Success:

- Planner response is normalized.
- `plannerModeUsed` reports `qwen` or `qwen_repaired`.
- Plan steps validate against ForgePilot schemas.

Fallback:

- In `auto` mode, ForgePilot can fall back to `local_fallback`.
- In strict `qwen` mode, missing env or invalid response returns a clean error.

## Test Qwen Tool Selection

PowerShell:

```powershell
$body = @{
  goal = "Prepare my Qwen Cloud hackathon submission pack."
  executionMode = "qwen_tools"
  allowFallback = $true
  context = @{ completedTools = @() }
} | ConvertTo-Json -Depth 5

Invoke-RestMethod `
  -Method POST `
  -Uri http://localhost:3000/api/qwen/tool-call `
  -ContentType "application/json" `
  -Body $body
```

cURL:

```bash
curl -X POST http://localhost:3000/api/qwen/tool-call \
  -H "Content-Type: application/json" \
  -d "{\"goal\":\"Prepare my Qwen Cloud hackathon submission pack.\",\"executionMode\":\"qwen_tools\",\"allowFallback\":true,\"context\":{\"completedTools\":[]}}"
```

Success:

- Qwen returns a selected tool call.
- ForgePilot validates the tool name against the local registry.
- The route does not execute the tool.

Fallback:

- If Qwen env vars are missing and fallback is allowed, the response explains local fallback.
- Without fallback in strict `qwen_tools`, the route returns a normalized `QWEN_NOT_CONFIGURED` error.

## Test End-To-End Demo Mode

PowerShell:

```powershell
$body = @{ plannerMode = "auto"; executionMode = "auto" } | ConvertTo-Json
Invoke-RestMethod `
  -Method POST `
  -Uri http://localhost:3000/api/runs/demo `
  -ContentType "application/json" `
  -Body $body
```

cURL:

```bash
curl -X POST http://localhost:3000/api/runs/demo \
  -H "Content-Type: application/json" \
  -d "{\"plannerMode\":\"auto\",\"executionMode\":\"auto\"}"
```

Success:

- Run reaches `awaiting_approval`.
- Runtime Brain records requested and used modes.
- Qwen metadata appears only when configured.
- Artifacts are absent before approval.

## Do Not Commit

- `.env.local`
- Real Qwen API keys
- Real webhook secrets
- Screenshots that expose secrets
- Provider console pages that expose secret values
