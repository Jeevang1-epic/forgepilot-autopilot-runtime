type ProofSectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
};

export function ProofSection({ eyebrow, title, body, points }: ProofSectionProps) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/46">{eyebrow}</p>
      <h3 className="mt-3 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-white/64">{body}</p>
      <div className="mt-5 space-y-3">
        {points.map((point) => (
          <div key={point} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-200" />
            <p className="text-sm leading-6 text-white/68">{point}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
