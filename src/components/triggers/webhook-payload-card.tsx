type WebhookPayloadCardProps = {
  payload: Record<string, unknown>;
};

const curlExample = `curl -X POST http://localhost:3000/api/webhooks/forgepilot \\
  -H "Content-Type: application/json" \\
  -d "{\\"goal\\":\\"Prepare my Qwen Cloud hackathon submission pack.\\",\\"source\\":\\"manual_test\\",\\"plannerMode\\":\\"auto\\",\\"executionMode\\":\\"auto\\",\\"metadata\\":{\\"triggerName\\":\\"Trigger Lab\\",\\"requestId\\":\\"local-test-001\\",\\"notes\\":\\"Manual webhook smoke test.\\"}}"`;

const powerShellExample = `Invoke-RestMethod \`
  -Method POST \`
  -Uri http://localhost:3000/api/webhooks/forgepilot \`
  -ContentType "application/json" \`
  -Body '{"goal":"Prepare my Qwen Cloud hackathon submission pack.","source":"manual_test","plannerMode":"auto","executionMode":"auto","metadata":{"triggerName":"Trigger Lab","requestId":"local-test-001","notes":"Manual webhook smoke test."}}'`;

export function WebhookPayloadCard({ payload }: WebhookPayloadCardProps) {
  return (
    <section className="rounded-lg border border-white/10 bg-black/28 p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/70">
            Payload Preview
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Exact webhook request body
          </h2>
        </div>
        <span className="w-fit rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-xs text-white/62">
          POST /api/webhooks/forgepilot
        </span>
      </div>

      <pre className="mt-5 max-h-80 overflow-auto rounded-lg border border-white/10 bg-black/45 p-4 text-xs leading-5 text-white/72">
        {JSON.stringify(payload, null, 2)}
      </pre>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-white">cURL smoke test</p>
          <pre className="mt-3 max-h-72 overflow-auto rounded-lg border border-white/10 bg-white/[0.04] p-4 text-xs leading-5 text-white/68">
            {curlExample}
          </pre>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">PowerShell smoke test</p>
          <pre className="mt-3 max-h-72 overflow-auto rounded-lg border border-white/10 bg-white/[0.04] p-4 text-xs leading-5 text-white/68">
            {powerShellExample}
          </pre>
        </div>
      </div>
    </section>
  );
}
