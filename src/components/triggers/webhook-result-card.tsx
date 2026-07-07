import Link from "next/link";

export type WebhookTestResult = {
  runId: string;
  status: string;
  triggerType: string;
  plannerModeUsed: string;
  executionModeUsed: string;
  approvalRequired: boolean;
  artifactsCount: number;
  runUrl: string;
};

type WebhookResultCardProps = {
  result?: WebhookTestResult;
  error?: string | null;
  isSending: boolean;
};

const resultFields = [
  ["Run ID", "runId"],
  ["Status", "status"],
  ["Trigger", "triggerType"],
  ["Planner", "plannerModeUsed"],
  ["Execution", "executionModeUsed"],
  ["Approval", "approvalRequired"],
  ["Artifacts", "artifactsCount"],
] as const;

export function WebhookResultCard({
  result,
  error,
  isSending,
}: WebhookResultCardProps) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/70">
            Webhook Result
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Runtime handoff response
          </h2>
        </div>
        <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white/62">
          {isSending ? "sending" : result ? "received" : "idle"}
        </span>
      </div>

      {error ? (
        <p className="mt-5 rounded-lg border border-rose-200/25 bg-rose-200/10 px-3 py-2 text-sm leading-6 text-rose-100">
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {resultFields.map(([label, key]) => (
            <div key={label} className="rounded-lg border border-white/10 bg-black/25 p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-white/42">
                {label}
              </p>
              <p className="mt-2 break-words text-sm font-semibold text-white">
                {typeof result[key] === "boolean"
                  ? result[key]
                    ? "required"
                    : "not required"
                  : String(result[key]).replaceAll("_", " ")}
              </p>
            </div>
          ))}
          <Link
            href={result.runUrl}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-teal-200 px-4 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-950/20 transition hover:bg-teal-100 sm:col-span-2"
          >
            View flight recorder
          </Link>
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-white/10 bg-black/25 p-4">
          <p className="text-sm leading-6 text-white/62">
            Send a test webhook to create a local ForgePilot run. The response will
            show the planner mode, execution mode, approval requirement, and run URL.
          </p>
        </div>
      )}
    </section>
  );
}
