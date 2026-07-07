"use client";

import type { ExecutionModeRequested } from "@/lib/runtime/types";
import { cn } from "@/lib/utils";

const executionModes: Array<{
  value: ExecutionModeRequested;
  label: string;
  description: string;
}> = [
  {
    value: "local",
    label: "Local Runtime",
    description: "Deterministic offline flow.",
  },
  {
    value: "qwen_plan",
    label: "Qwen Plan",
    description: "Qwen plans, app executes.",
  },
  {
    value: "qwen_tools",
    label: "Qwen Tool Calling",
    description: "Qwen selects, app validates and executes.",
  },
  {
    value: "auto",
    label: "Auto",
    description: "Best available mode with safe fallback.",
  },
];

type ExecutionModeSelectorProps = {
  value: ExecutionModeRequested;
  onChange: (value: ExecutionModeRequested) => void;
  compact?: boolean;
};

export function ExecutionModeSelector({
  value,
  onChange,
  compact = false,
}: ExecutionModeSelectorProps) {
  return (
    <div className={cn("grid gap-2", compact ? "sm:grid-cols-2 xl:grid-cols-4" : "lg:grid-cols-4")}>
      {executionModes.map((mode) => {
        const isActive = mode.value === value;

        return (
          <button
            key={mode.value}
            type="button"
            onClick={() => onChange(mode.value)}
            className={cn(
              "rounded-lg border p-3 text-left transition",
              isActive
                ? "border-cyan-200/45 bg-cyan-200/[0.12] text-white shadow-lg shadow-cyan-950/20"
                : "border-white/10 bg-black/25 text-white/62 hover:border-white/20 hover:bg-white/[0.055]",
            )}
          >
            <span className="text-sm font-semibold">{mode.label}</span>
            <span className="mt-1 block text-xs leading-5 text-white/52">
              {mode.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
