import type { Artifact, ArtifactStatus } from "@/lib/runtime/types";
import { cn } from "@/lib/utils";

const statusTone: Record<ArtifactStatus, string> = {
  drafted: "border-amber-200/30 bg-amber-200/10 text-amber-100",
  written: "border-emerald-200/30 bg-emerald-200/10 text-emerald-100",
  approved: "border-teal-200/30 bg-teal-200/10 text-teal-100",
};

type ArtifactPanelProps = {
  artifacts: Artifact[];
};

export function ArtifactPanel({ artifacts }: ArtifactPanelProps) {
  return (
    <aside className="rounded-lg border border-white/10 bg-white/[0.05] p-5 shadow-2xl shadow-black/25 xl:sticky xl:top-28">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/46">
            Artifact Pack
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">Local output pack</h2>
        </div>
        <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-xs text-white/66">
          {artifacts.length} files
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {artifacts.map((artifact) => (
          <div key={artifact.id} className="rounded-lg border border-white/10 bg-black/25 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-sm font-semibold text-white">{artifact.fileName}</p>
                <p className="mt-2 text-xs leading-5 text-white/58">{artifact.description}</p>
              </div>
              <span className={cn("shrink-0 rounded-full border px-2 py-1 text-[11px]", statusTone[artifact.status])}>
                {artifact.status}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
              <span className="font-mono text-xs text-white/46">{artifact.path}</span>
              <span className="font-mono text-xs text-white/62">{artifact.size}</span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
