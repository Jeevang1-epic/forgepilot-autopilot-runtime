export type RuntimeErrorCode =
  | "BAD_REQUEST"
  | "RUN_NOT_FOUND"
  | "APPROVAL_NOT_FOUND"
  | "RUN_NOT_APPROVABLE"
  | "TOOL_EXECUTION_FAILED"
  | "QWEN_NOT_CONFIGURED"
  | "QWEN_PLANNER_FAILED"
  | "QWEN_PLANNER_INVALID"
  | "QWEN_TOOL_CALL_FAILED"
  | "QWEN_TOOL_CALL_INVALID";

export class RuntimeError extends Error {
  code: RuntimeErrorCode;
  status: number;

  constructor(code: RuntimeErrorCode, message: string, status = 400) {
    super(message);
    this.name = "RuntimeError";
    this.code = code;
    this.status = status;
  }
}

export function isRuntimeError(error: unknown): error is RuntimeError {
  return error instanceof RuntimeError;
}
