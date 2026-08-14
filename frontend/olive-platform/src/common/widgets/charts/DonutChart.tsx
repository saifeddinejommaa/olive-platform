type DonutItem = {
  label: string;
  pct: number;
  color: string;
};

export default function DonutChart({ data }: { data: DonutItem[] }) {
  const r = 44, cx = 56, cy = 56, stroke = 13, circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg viewBox="0 0 112 112" width={100} height={100}>
      {data.map((d, i) => {
        const dash = (d.pct / 100) * circ;
        const gap = circ - dash;

        const seg = (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={d.color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
          />
        );

        offset += dash;
        return seg;
      })}
    </svg>
  );
}