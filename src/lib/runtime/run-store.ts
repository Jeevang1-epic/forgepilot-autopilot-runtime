import { recentRuns } from "./sample-runs";
import type { ForgePilotRun } from "./types";

type StoreGlobal = typeof globalThis & {
  __forgePilotRuns?: Map<string, ForgePilotRun>;
};

const storeGlobal = globalThis as StoreGlobal;

function cloneRun(run: ForgePilotRun): ForgePilotRun {
  return structuredClone(run);
}

function getStore() {
  if (!storeGlobal.__forgePilotRuns) {
    storeGlobal.__forgePilotRuns = new Map(
      recentRuns.map((run) => [run.id, cloneRun(run)]),
    );
  }

  return storeGlobal.__forgePilotRuns;
}

export function listRuns() {
  return Array.from(getStore().values()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export function getRun(runId: string) {
  return getStore().get(runId);
}

export function saveRun(run: ForgePilotRun) {
  getStore().set(run.id, run);
  return run;
}

export function findRunByApprovalId(approvalId: string) {
  return listRuns().find((run) =>
    run.approvalRequests.some((approval) => approval.id === approvalId),
  );
}
