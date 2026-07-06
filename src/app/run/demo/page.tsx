"use client";

import { ArtifactPanel } from "@/components/flight-recorder/artifact-panel";
import { ApprovalPreview } from "@/components/flight-recorder/approval-preview";
import { FlightTimeline } from "@/components/flight-recorder/flight-timeline";
import { ToolCallCard } from "@/components/flight-recorder/tool-call-card";
import { demoRun } from "@/lib/runtime/sample-runs";
import type { ApprovalDecision, ForgePilotRun } from "@/lib/runtime/types";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function DemoRunPage() {
  const router = useRouter();
  const [run, setRun] = useState<ForgePilotRun>(demoRun);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);
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
          : await fetch("/api/runs/demo", { method: "POST" });
        const payload = (await response.json()) as {
          run?: ForgePilotRun;
          error?: string;
        };

        if (!response.ok || !payload.run) {
          throw new Error(payload.error ?? "Unable to load run.");
        }

        if (!isMounted) {
          return;
        }

        setRun(payload.run);

        if (!runId) {
          router.replace(`/run/demo?runId=${payload.run.id}`);
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

    try {
      const response = await fetch("/api/runs/demo", {
        method: "POST",
      });
      const payload = (await response.json()) as {
        run?: ForgePilotRun;
        error?: string;
      };

      if (!response.ok || !payload.run) {
        throw new Error(payload.error ?? "Unable to replay run.");
      }

      setRun(payload.run);
      router.replace(`/run/demo?runId=${payload.run.id}`);
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
      const payload = (await response.json()) as {
        run?: ForgePilotRun;
        error?: string;
      };

      if (!response.ok || !payload.run) {
        throw new Error(payload.error ?? "Unable to submit approval decision.");
      }

      setRun(payload.run);
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

        <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row">
          <button
            type="button"
            onClick={() => void startFreshRun()}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-teal-200 px-4 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-950/20 transition hover:bg-teal-100"
          >
            Run Replay
          </button>
          <button
            type="button"
            onClick={() => setShowReport((current) => !current)}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-white/12 bg-white/[0.055] px-4 text-sm font-semibold text-white/78 transition hover:border-white/20 hover:bg-white/[0.08]"
          >
            Export Run Report
          </button>
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
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/70">
                Export Run Report
              </p>
              <pre className="mt-4 max-h-[32rem] overflow-auto rounded-lg border border-white/10 bg-black/45 p-4 text-xs leading-5 text-white/72">
                {runReport}
              </pre>
            </section>
          ) : null}
        </div>
        <ArtifactPanel artifacts={run.artifacts} />
      </div>
    </div>
  );
}
