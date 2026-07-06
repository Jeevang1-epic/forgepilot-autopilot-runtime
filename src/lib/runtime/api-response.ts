import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { isRuntimeError } from "./errors";

type ApiError = {
  code: string;
  message: string;
};

export function ok<TData>(data: TData, status = 200) {
  return NextResponse.json(
    {
      ok: true,
      data,
    },
    { status },
  );
}

export function fail(code: string, message: string, status = 400) {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code,
        message,
      } satisfies ApiError,
    },
    { status },
  );
}

export function failFromError(error: unknown) {
  if (isRuntimeError(error)) {
    return fail(error.code, error.message, error.status);
  }

  if (error instanceof ZodError) {
    return fail("VALIDATION_ERROR", error.issues[0]?.message ?? "Invalid request.", 400);
  }

  if (error instanceof SyntaxError) {
    return fail("INVALID_JSON", "Request body must be valid JSON.", 400);
  }

  return fail(
    "INTERNAL_ERROR",
    error instanceof Error ? error.message : "Unexpected runtime error.",
    500,
  );
}
