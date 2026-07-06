import { NextResponse } from "next/server";

import { approveRunAction, rejectRunAction } from "@/lib/runtime/run-engine";
import { approvalDecisionSchema } from "@/lib/validation/schemas";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = approvalDecisionSchema.parse(body);
    const run =
      input.decision === "approved"
        ? await approveRunAction(input)
        : await rejectRunAction(input);

    return NextResponse.json({ run });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to process approval decision.",
      },
      { status: 400 },
    );
  }
}
