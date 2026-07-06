"use client";

import type { PlannerModeRequested } from "@/lib/runtime/types";
import { cn } from "@/lib/utils";

const plannerModes: Array<{
  value: PlannerModeRequested;
  label: string;
  description: string;
}> = [
  {
    value: "auto",
    label: "Auto",
    description: "Qwen if configured, local fallback otherwise.",
  },
  {
    value: "local",
    label: "Local",
    description: "Deterministic offline planner.",
  },
  {
    value: "qwen",
    label: "Qwen Cloud",
    description: "Requires env config.",
  },
];

type PlannerModeSelectorProps = {
  value: PlannerModeRequested;
  onChange: (value: PlannerModeRequested) => void;
  compact?: boolean;
};

export function PlannerModeSelector({
  value,
  onChange,
  compact = false,
}: PlannerModeSelectorProps) {
  return (
    <div className={cn("grid gap-2", compact ? "sm:grid-cols-3" : "lg:grid-cols-3")}>
      {plannerModes.map((mode) => {
        const isActive = mode.value === value;

        return (
          <button
            key={mode.value}
            type="button"
            onClick={() => onChange(mode.value)}
            className={cn(
              "rounded-lg border p-3 text-left transition",
              isActive
                ? "border-teal-200/45 bg-teal-200/[0.12] text-white shadow-lg shadow-teal-950/20"
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
