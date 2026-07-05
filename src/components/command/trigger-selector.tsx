"use client";

import type { TriggerType } from "@/lib/runtime/types";
import { cn } from "@/lib/utils";

type TriggerOption = {
  value: TriggerType;
  label: string;
  description: string;
};

const triggerOptions: TriggerOption[] = [
  {
    value: "manual",
    label: "Manual Command",
    description: "Paste a messy request and launch the run directly.",
  },
  {
    value: "webhook",
    label: "Webhook Trigger",
    description: "Reserve an intake point for external automation events.",
  },
  {
    value: "scheduled",
    label: "Scheduled Demo",
    description: "Rehearse the same workflow on a predictable cadence.",
  },
];

type TriggerSelectorProps = {
  value: TriggerType;
  onChange: (value: TriggerType) => void;
};

export function TriggerSelector({ value, onChange }: TriggerSelectorProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {triggerOptions.map((option) => {
        const isSelected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-lg border p-4 text-left transition",
              isSelected
                ? "border-teal-300/40 bg-teal-300/10 shadow-lg shadow-teal-950/20"
                : "border-white/10 bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.06]",
            )}
          >
            <span className="text-sm font-semibold text-white">{option.label}</span>
            <span className="mt-2 block text-xs leading-5 text-white/50">
              {option.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
