import { NextResponse } from "next/server";

import {
  createDemoAutopilotRun,
  executeAutopilotRun,
} from "@/lib/runtime/run-engine";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const run = createDemoAutopilotRun();
    const executedRun = await executeAutopilotRun(run.id);

    return NextResponse.json({ run: executedRun }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to start demo run.",
      },
      { status: 400 },
    );
  }
}
