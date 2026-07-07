"use client";

import { useMemo, useState } from "react";

import type {
  ExecutionModeRequested,
  PlannerModeRequested,
  WebhookTriggerSource,
} from "@/lib/runtime/types";

import { N8nBridgeCard } from "./n8n-bridge-card";
import { WebhookPayloadCard } from "./webhook-payload-card";
import {
  WebhookResultCard,
  type WebhookTestResult,
} from "./webhook-result-card";

type ApiResponse<TData> =
  | {
      ok: true;
      data: TData;
    }
  | {
      ok: false;
      error: {
        code: string;
        message: string;
      };
    };

const sourceOptions: Array<{ value: WebhookTriggerSource; label: string }> = [
  { value: "manual_test", label: "Manual Test" },
  { value: "n8n", label: "n8n" },
  { value: "external", label: "External" },
];

const plannerModeOptions: PlannerModeRequested[] = ["auto", "local", "qwen"];
const executionModeOptions: ExecutionModeRequested[] = [
  "auto",
  "local",
  "qwen_plan",
  "qwen_tools",
];

export function TriggerLab() {
  const [goal, setGoal] = useState(
    "Prepare my Qwen Cloud hackathon submission pack.",
  );
  const [source, setSource] = useState<WebhookTriggerSource>("manual_test");
  const [plannerMode, setPlannerMode] = useState<PlannerModeRequested>("auto");
  const [executionMode, setExecutionMode] =
    useState<ExecutionModeRequested>("auto");
  const [triggerName, setTriggerName] = useState("Trigger Lab");
  const [requestId, setRequestId] = useState("local-test-001");
  const [notes, setNotes] = useState(
    "Manual webhook smoke test from the ForgePilot Trigger Lab.",
  );
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<WebhookTestResult | undefined>();
  const [error, setError] = useState<string | null>(null);

  const payload = useMemo(
    () => ({
      goal,
      source,
      plannerMode,
      executionMode,
      metadata: {
        triggerName,
        requestId,
        notes,
      },
    }),
    [executionMode, goal, notes, plannerMode, requestId, source, triggerName],
  );

  async function sendWebhook() {
    setIsSending(true);
    setError(null);
    setResult(undefined);

    try {
      const response = await fetch("/api/webhooks/forgepilot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as ApiResponse<WebhookTestResult>;

      if (!response.ok || !body.ok) {
        throw new Error(body.ok ? "Webhook request failed." : body.error.message);
      }

      setResult(body.data);
    } catch (webhookError) {
      setError(
        webhookError instanceof Error
          ? webhookError.message
          : "Webhook request failed.",
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-black/25 p-6 shadow-2xl shadow-black/30 sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/70">
              Trigger Lab
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Test inbound autopilot triggers without leaving the local runtime.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-white/66">
              Send a safe POST payload into ForgePilot, create a webhook-triggered
              run, and verify that planning, tool validation, approval, and Flight
              Recorder proof stay inside the app.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[28rem]">
            <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/42">
                Endpoint
              </p>
              <p className="mt-2 font-mono text-sm text-white">
                /api/webhooks/forgepilot
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/42">
                Boundary
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                local execution
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/42">
                Safety
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                approval gated
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <section className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/70">
                Webhook Payload
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Create a run from JSON
              </h2>
            </div>
            <button
              type="button"
              onClick={() => void sendWebhook()}
              disabled={isSending}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-teal-200 px-4 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-950/20 transition hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSending ? "Sending..." : "Send Test Webhook"}
            </button>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <label className="lg:col-span-2">
              <span className="text-sm font-medium text-white/72">Goal</span>
              <textarea
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
                rows={3}
                className="mt-2 w-full rounded-lg border border-white/10 bg-black/28 px-3 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/34 focus:border-teal-200/45"
              />
            </label>

            <label>
              <span className="text-sm font-medium text-white/72">Source</span>
              <select
                value={source}
                onChange={(event) =>
                  setSource(event.target.value as WebhookTriggerSource)
                }
                className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-black/28 px-3 text-sm text-white outline-none transition focus:border-teal-200/45"
              >
                {sourceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="text-sm font-medium text-white/72">
                Trigger name
              </span>
              <input
                value={triggerName}
                onChange={(event) => setTriggerName(event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-black/28 px-3 text-sm text-white outline-none transition placeholder:text-white/34 focus:border-teal-200/45"
              />
            </label>

            <label>
              <span className="text-sm font-medium text-white/72">
                Planner mode
              </span>
              <select
                value={plannerMode}
                onChange={(event) =>
                  setPlannerMode(event.target.value as PlannerModeRequested)
                }
                className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-black/28 px-3 text-sm text-white outline-none transition focus:border-teal-200/45"
              >
                {plannerModeOptions.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode.replace("_", " ")}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="text-sm font-medium text-white/72">
                Execution mode
              </span>
              <select
                value={executionMode}
                onChange={(event) =>
                  setExecutionMode(event.target.value as ExecutionModeRequested)
                }
                className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-black/28 px-3 text-sm text-white outline-none transition focus:border-teal-200/45"
              >
                {executionModeOptions.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="text-sm font-medium text-white/72">Request ID</span>
              <input
                value={requestId}
                onChange={(event) => setRequestId(event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-black/28 px-3 text-sm text-white outline-none transition placeholder:text-white/34 focus:border-teal-200/45"
              />
            </label>

            <label className="lg:col-span-2">
              <span className="text-sm font-medium text-white/72">Notes</span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                className="mt-2 w-full rounded-lg border border-white/10 bg-black/28 px-3 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/34 focus:border-teal-200/45"
              />
            </label>
          </div>
        </section>

        <WebhookResultCard
          result={result}
          error={error}
          isSending={isSending}
        />
      </div>

      <WebhookPayloadCard payload={payload} />
      <N8nBridgeCard />
    </div>
  );
}
