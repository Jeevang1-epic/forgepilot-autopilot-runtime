import { NextResponse } from "next/server";

import { createAutopilotRun } from "@/lib/runtime/run-engine";
import { listRuns } from "@/lib/runtime/run-store";
import { createRunSchema } from "@/lib/validation/schemas";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    runs: listRuns(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = createRunSchema.parse(body);
    const run = createAutopilotRun(input);

    return NextResponse.json({ run }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to create run.",
      },
      { status: 400 },
    );
  }
}
