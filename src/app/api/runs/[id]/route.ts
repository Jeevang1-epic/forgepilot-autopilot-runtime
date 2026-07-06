import { NextResponse } from "next/server";

import { getRun } from "@/lib/runtime/run-store";

export const dynamic = "force-dynamic";

type RunRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RunRouteContext) {
  const { id } = await context.params;
  const run = getRun(id);

  if (!run) {
    return NextResponse.json({ error: "Run not found." }, { status: 404 });
  }

  return NextResponse.json({ run });
}
