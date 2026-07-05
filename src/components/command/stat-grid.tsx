type RuntimeStat = {
  label: string;
  value: string;
  detail: string;
};

type StatGridProps = {
  stats: RuntimeStat[];
};

export function StatGrid({ stats }: StatGridProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <p className="text-sm text-white/50">{stat.label}</p>
          <p className="mt-3 font-mono text-3xl font-semibold tracking-tight text-white">
            {stat.value}
          </p>
          <p className="mt-2 text-xs leading-5 text-white/42">{stat.detail}</p>
        </div>
      ))}
    </section>
  );
}
