"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { ForgePilotRun } from "@/lib/runtime/types";
import type { TriggerType } from "@/lib/runtime/types";
import { cn } from "@/lib/utils";

import { TriggerSelector } from "./trigger-selector";

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

const defaultCommand = "Prepare my Qwen Cloud hackathon submission pack.";

const executionPreview = [
  "Trigger captured",
  "Qwen planner drafts workflow",
  "Human approval gate opens",
  "Artifacts written locally",
];

export function CommandCenter() {
  const router = useRouter();
  const [command, setCommand] = useState(defaultCommand);
  const [triggerType, setTriggerType] = useState<TriggerType>("manual");
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startDemoRun() {
    setIsStarting(true);
    setError(null);

    try {
      const response = await fetch("/api/runs/demo", {
        method: "POST",
      });
      const payload = (await response.json()) as ApiResponse<{
        run?: ForgePilotRun;
      }>;

      if (!response.ok || !payload.ok || !payload.data.run) {
        throw new Error(
          payload.ok ? "Unable to start demo run." : payload.error.message,
        );
      }

      router.push(`/run/demo?runId=${payload.data.run.id}`);
    } catch (startError) {
      setError(
        startError instanceof Error
          ? startError.message
          : "Unable to start demo run.",
      );
    } finally {
      setIsStarting(false);
    }
  }

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/70">
            Command Intake
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Start an autopilot run</h2>
        </div>
        <span className="w-fit rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white/66">
          local-first demo mode
        </span>
      </div>

      <label className="mt-6 block">
        <span className="text-sm font-medium text-white/72">Command</span>
        <textarea
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          className="mt-3 min-h-32 w-full resize-none rounded-lg border border-white/12 bg-black/35 p-4 font-mono text-sm leading-6 text-white outline-none ring-0 transition placeholder:text-white/35 focus:border-teal-300/50 focus:bg-black/45"
          spellCheck={false}
        />
      </label>

      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-white/72">Trigger selector</span>
          <span className="text-xs font-medium text-white/50">{triggerType.replace("_", " ")}</span>
        </div>
        <TriggerSelector value={triggerType} onChange={setTriggerType} />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        {executionPreview.map((item, index) => (
          <div
            key={item}
            className={cn(
              "rounded-lg border border-white/10 bg-black/25 p-3",
              index === 1 && "border-cyan-200/25 bg-cyan-200/[0.075]",
            )}
          >
            <p className="font-mono text-xs text-white/44">0{index + 1}</p>
            <p className="mt-2 text-sm font-medium leading-5 text-white/78">{item}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-white/62">
          {error ??
            "The run will pause before writing artifacts that include public-facing claims."}
        </p>
        <button
          type="button"
          onClick={startDemoRun}
          disabled={isStarting}
          className="inline-flex h-12 items-center justify-center rounded-lg bg-teal-200 px-5 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-950/30 transition hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isStarting ? "Starting Runtime..." : "Start Autopilot Run"}
        </button>
      </div>
    </section>
  );
}
