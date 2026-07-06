"use client";

import { PlannerModeSelector } from "@/components/command/planner-mode-selector";
import { ArtifactPanel } from "@/components/flight-recorder/artifact-panel";
import { ApprovalPreview } from "@/components/flight-recorder/approval-preview";
import { FlightTimeline } from "@/components/flight-recorder/flight-timeline";
import { ToolCallCard } from "@/components/flight-recorder/tool-call-card";
import { demoRun } from "@/lib/runtime/sample-runs";
import type {
  ApprovalDecision,
  ForgePilotRun,
  PlannerModeRequested,
  PlannerModeUsed,
} from "@/lib/runtime/types";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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

const statusTone: Record<ForgePilotRun["status"], string> = {
  queued: "border-white/15 bg-white/[0.06] text-white/72",
  planning: "border-cyan-200/30 bg-cyan-200/10 text-cyan-100",
  running: "border-teal-200/30 bg-teal-200/10 text-teal-100",
  awaiting_approval: "border-amber-200/35 bg-amber-200/12 text-amber-100",
  completed: "border-emerald-200/30 bg-emerald-200/10 text-emerald-100",
  failed: "border-rose-200/30 bg-rose-200/10 text-rose-100",
};

const plannerModeLabel: Record<PlannerModeUsed, string> = {
  local: "Local deterministic planner",
  qwen: "Qwen Cloud planner",
  qwen_repaired: "Qwen Cloud planner, repaired JSON",
  local_fallback: "Local fallback planner",
};

const plannerModeTone: Record<PlannerModeUsed, string> = {
  local: "border-white/12 bg-white/[0.06] text-white/72",
  qwen: "border-teal-200/30 bg-teal-200/10 text-teal-100",
  qwen_repaired: "border-cyan-200/30 bg-cyan-200/10 text-cyan-100",
  local_fallback: "border-amber-200/35 bg-amber-200/12 text-amber-100",
};

export default function DemoRunPage() {
  const router = useRouter();
  const [run, setRun] = useState<ForgePilotRun>(demoRun);
  const [plannerMode, setPlannerMode] = useState<PlannerModeRequested>("auto");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const approval = useMemo(
    () =>
      run.approvalRequests.find((item) => item.status === "requested") ??
      run.approvalRequests[0],
    [run.approvalRequests],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadRun() {
      setIsLoading(true);
      setError(null);

      try {
        const runId = new URLSearchParams(window.location.search).get("runId");
        const response = runId
          ? await fetch(`/api/runs/${runId}`)
          : await fetch("/api/runs/demo", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                plannerMode: "auto",
              }),
            });
        const payload = (await response.json()) as ApiResponse<{
          run?: ForgePilotRun;
        }>;

        if (!response.ok || !payload.ok || !payload.data.run) {
          throw new Error(payload.ok ? "Unable to load run." : payload.error.message);
        }

        if (!isMounted) {
          return;
        }

        setRun(payload.data.run);
        setPlannerMode(payload.data.run.plannerModeRequested);

        if (!runId) {
          router.replace(`/run/demo?runId=${payload.data.run.id}`);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load run.",
          );
          setRun(demoRun);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadRun();

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function startFreshRun() {
    setIsLoading(true);
    setError(null);
    setShowReport(false);
    setCopyState("idle");

    try {
      const response = await fetch("/api/runs/demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plannerMode,
        }),
      });
      const payload = (await response.json()) as ApiResponse<{
        run?: ForgePilotRun;
      }>;

      if (!response.ok || !payload.ok || !payload.data.run) {
        throw new Error(payload.ok ? "Unable to replay run." : payload.error.message);
      }

      setRun(payload.data.run);
      setPlannerMode(payload.data.run.plannerModeRequested);
      router.replace(`/run/demo?runId=${payload.data.run.id}`);
    } catch (replayError) {
      setError(
        replayError instanceof Error ? replayError.message : "Unable to replay run.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function submitApproval(decision: ApprovalDecision) {
    if (!approval) {
      return;
    }

    setIsSubmittingApproval(true);
    setError(null);
    setCopyState("idle");

    try {
      const response = await fetch("/api/approvals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          approvalId: approval.id,
          decision,
        }),
      });
      const payload = (await response.json()) as ApiResponse<{
        run?: ForgePilotRun;
      }>;

      if (!response.ok || !payload.ok || !payload.data.run) {
        throw new Error(
          payload.ok
            ? "Unable to submit approval decision."
            : payload.error.message,
        );
      }

      setRun(payload.data.run);
      setShowReport(decision === "approved");
    } catch (approvalError) {
      setError(
        approvalError instanceof Error
          ? approvalError.message
          : "Unable to submit approval decision.",
      );
    } finally {
      setIsSubmittingApproval(false);
    }
  }

  const runReport = JSON.stringify(run.report ?? run, null, 2);

  async function copyRunReport() {
    try {
      await navigator.clipboard.writeText(runReport);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-black/25 p-6 shadow-2xl shadow-black/30 sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/70">
              Run Overview
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {run.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/66">{run.summary}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/46">
                Run status
              </span>
              <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${statusTone[run.status]}`}>
                {isLoading ? "loading" : run.status.replace("_", " ")}
              </span>
            </div>
            {run.plannerWarnings.length > 0 ? (
              <div className="mt-3 space-y-2">
                {run.plannerWarnings.map((warning) => (
                  <p
                    key={warning}
                    className="max-w-3xl rounded-lg border border-amber-200/25 bg-amber-200/10 px-3 py-2 text-sm text-amber-100"
                  >
                    {warning}
                  </p>
                ))}
              </div>
            ) : null}
            {error ? (
              <p className="mt-3 max-w-3xl rounded-lg border border-rose-200/25 bg-rose-200/10 px-3 py-2 text-sm text-rose-100">
                {error}
              </p>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[32rem]">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/42">Status</p>
              <p className="mt-2 text-sm font-semibold capitalize text-emerald-100">
                {isLoading ? "loading" : run.status.replace("_", " ")}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/42">Tool calls</p>
              <p className="mt-2 font-mono text-xl font-semibold text-white">
                {run.toolCalls.length}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/42">Artifacts</p>
              <p className="mt-2 font-mono text-xl font-semibold text-white">
                {run.artifacts.length}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 border-t border-white/10 pt-5 xl:grid-cols-[1fr_22rem]">
          <div>
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-white/72">Planner mode for replay</p>
                <p className="mt-1 text-xs leading-5 text-white/50">
                  Replays create a new run with the selected planner mode.
                </p>
              </div>
              <span className="w-fit rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs capitalize text-white/62">
                {plannerMode}
              </span>
            </div>
            <PlannerModeSelector
              value={plannerMode}
              onChange={setPlannerMode}
              compact
            />
          </div>

          <div className="flex flex-col justify-end gap-3 sm:flex-row xl:flex-col">
            <button
              type="button"
              onClick={() => void startFreshRun()}
              disabled={isLoading}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-teal-200 px-4 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-950/20 transition hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Starting..." : "Start Fresh Demo Run"}
            </button>
            <button
              type="button"
              onClick={() => setShowReport((current) => !current)}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-white/12 bg-white/[0.055] px-4 text-sm font-semibold text-white/78 transition hover:border-white/20 hover:bg-white/[0.08]"
            >
              View Run Report
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/70">
              Planner Brain
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              {plannerModeLabel[run.plannerModeUsed]}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/62">
              ForgePilot uses the planner only to produce a validated plan. Tool
              execution, approvals, artifact creation, and run reports stay inside the
              runtime.
            </p>
          </div>
          <span className={`w-fit rounded-full border px-3 py-1.5 text-xs font-semibold ${plannerModeTone[run.plannerModeUsed]}`}>
            {run.plannerModeUsed.replace("_", " ")}
          </span>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <div className="rounded-lg border border-white/10 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/42">Requested</p>
            <p className="mt-2 text-sm font-semibold capitalize text-white">
              {run.plannerModeRequested}
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/42">Used</p>
            <p className="mt-2 text-sm font-semibold text-white">
              {plannerModeLabel[run.plannerModeUsed]}
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/42">Qwen config</p>
            <p className="mt-2 text-sm font-semibold text-white">
              {run.qwenConfigured ? "Configured" : "Not configured"}
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/42">Model</p>
            <p className="mt-2 text-sm font-semibold text-white">
              {run.qwenModel ?? "Not used"}
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/25 p-4 md:col-span-2">
            <p className="text-xs uppercase tracking-[0.18em] text-white/42">JSON repair</p>
            <p className="mt-2 text-sm font-semibold text-white">
              {run.qwenJsonRepairUsed ? "Used and recorded" : "Not needed"}
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/25 p-4 md:col-span-2">
            <p className="text-xs uppercase tracking-[0.18em] text-white/42">Fallback posture</p>
            <p className="mt-2 text-sm leading-6 text-white/68">
              {run.plannerModeUsed === "local_fallback"
                ? "Fallback protected the run from config/model failure."
                : "No fallback was needed for this run."}
            </p>
          </div>
        </div>
      </section>

      {approval ? (
        <ApprovalPreview
          approval={approval}
          isSubmitting={isSubmittingApproval}
          onApprove={() => void submitApproval("approved")}
          onReject={() => void submitApproval("rejected")}
        />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="space-y-6">
          <FlightTimeline steps={run.timeline} />

          <section className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/70">
                  Runtime Proof
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Tool calls and outputs</h2>
              </div>
              <span className="w-fit rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white/66">
                {run.toolCalls.length} recorded calls
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {run.toolCalls.map((toolCall) => (
                <ToolCallCard key={toolCall.id} toolCall={toolCall} />
              ))}
            </div>
          </section>

          {showReport ? (
            <section className="rounded-lg border border-white/10 bg-black/30 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/70">
                    View Run Report
                  </p>
                  <p className="mt-2 text-sm text-white/58">
                    Formatted JSON summary from the current runtime state.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void copyRunReport()}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-white/12 bg-white/[0.055] px-3 text-sm font-semibold text-white/78 transition hover:border-white/20 hover:bg-white/[0.08]"
                >
                  {copyState === "copied"
                    ? "Copied"
                    : copyState === "failed"
                      ? "Copy failed"
                      : "Copy Run Report"}
                </button>
              </div>
              <pre className="mt-4 max-h-[32rem] overflow-auto rounded-lg border border-white/10 bg-black/45 p-4 text-xs leading-5 text-white/72">
                {runReport}
              </pre>
            </section>
          ) : null}
        </div>
        <ArtifactPanel artifacts={run.status === "completed" ? run.artifacts : []} />
      </div>
    </div>
  );
}
