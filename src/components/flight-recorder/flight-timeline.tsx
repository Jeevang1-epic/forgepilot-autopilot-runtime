import type { TimelineStep } from "@/lib/runtime/types";

import { TimelineStepCard } from "./timeline-step-card";

type FlightTimelineProps = {
  steps: TimelineStep[];
};

export function FlightTimeline({ steps }: FlightTimelineProps) {
  return (
    <section className="relative">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/70">
            Flight Recorder
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Live run timeline</h2>
        </div>
        <span className="w-fit rounded-full border border-emerald-200/30 bg-emerald-200/10 px-3 py-1.5 text-xs font-medium text-emerald-100">
          sealed demo run
        </span>
      </div>

      <div className="relative space-y-4 lg:ml-8">
        <div className="absolute bottom-6 left-[-1.65rem] top-6 hidden w-px bg-gradient-to-b from-teal-200/50 via-white/12 to-transparent lg:block" />
        {steps.map((step, index) => (
          <TimelineStepCard key={step.id} step={step} index={index} />
        ))}
      </div>
    </section>
  );
}
