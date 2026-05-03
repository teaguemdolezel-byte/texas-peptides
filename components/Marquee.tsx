export default function Marquee({ items }: { items: string[] }) {
  const all = [...items, ...items];
  return (
    <div className="marquee divider-y bg-bg-2 py-3 text-bone-300">
      <div className="marquee-track">
        {all.map((it, i) => (
          <span
            key={i}
            className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em]"
          >
            <span className="h-1 w-1 bg-ox-500" />
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
