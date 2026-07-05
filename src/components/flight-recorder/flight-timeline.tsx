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
            Execution Timeline
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Tool execution as recorded</h2>
        </div>
        <span className="w-fit rounded-full border border-cyan-200/30 bg-cyan-200/10 px-3 py-1.5 text-xs font-medium text-cyan-100">
          replayable event stream
        </span>
      </div>

      <div className="relative space-y-4 lg:ml-8">
        <div className="absolute bottom-6 left-[-1.65rem] top-6 hidden w-px bg-gradient-to-b from-teal-200/60 via-amber-200/30 to-transparent lg:block" />
        {steps.map((step, index) => (
          <TimelineStepCard key={step.id} step={step} index={index} />
        ))}
      </div>
    </section>
  );
}
