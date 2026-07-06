import { failFromError, ok } from "@/lib/runtime/api-response";
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

    return ok({ run });
  } catch (error) {
    return failFromError(error);
  }
}
