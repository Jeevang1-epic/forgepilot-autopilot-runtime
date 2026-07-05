"use client";

import Link from "next/link";
import { useState } from "react";

import type { TriggerType } from "@/lib/runtime/types";
import { cn } from "@/lib/utils";

import { TriggerSelector } from "./trigger-selector";

const defaultCommand = "Prepare my Qwen Cloud hackathon submission pack.";

const executionPreview = [
  "Trigger captured",
  "Qwen planner drafts workflow",
  "Human approval gate opens",
  "Artifacts written locally",
];

export function CommandCenter() {
  const [command, setCommand] = useState(defaultCommand);
  const [triggerType, setTriggerType] = useState<TriggerType>("manual");

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/70">
            Command Intake
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Start an autopilot run</h2>
        </div>
        <span className="w-fit rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white/58">
          local-first demo mode
        </span>
      </div>

      <label className="mt-6 block">
        <span className="text-sm font-medium text-white/72">Command</span>
        <textarea
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          className="mt-3 min-h-32 w-full resize-none rounded-lg border border-white/10 bg-black/30 p-4 font-mono text-sm leading-6 text-white outline-none ring-0 transition placeholder:text-white/28 focus:border-teal-300/50 focus:bg-black/40"
          spellCheck={false}
        />
      </label>

      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-white/72">Trigger selector</span>
          <span className="text-xs text-white/38">{triggerType.replace("_", " ")}</span>
        </div>
        <TriggerSelector value={triggerType} onChange={setTriggerType} />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        {executionPreview.map((item, index) => (
          <div
            key={item}
            className={cn(
              "rounded-lg border border-white/10 bg-black/20 p-3",
              index === 1 && "border-cyan-200/20 bg-cyan-200/[0.055]",
            )}
          >
            <p className="font-mono text-xs text-white/34">0{index + 1}</p>
            <p className="mt-2 text-sm font-medium leading-5 text-white/72">{item}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-white/50">
          The run will pause before writing artifacts that include public-facing claims.
        </p>
        <Link
          href="/run/demo"
          className="inline-flex h-12 items-center justify-center rounded-lg bg-teal-200 px-5 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-950/30 transition hover:bg-teal-100"
        >
          Start Autopilot Run
        </Link>
      </div>
    </section>
  );
}
