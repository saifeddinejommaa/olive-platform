type Props = {
  label: string;
  value: string;
  sub: string;
  up: boolean;
  icon: string;
  color: string;
};

export default function KPICard({ label, value, sub, up, icon, color }: Props) {
  return (
    <div className="kpi-card" style={{ "--kpi-color": color } as React.CSSProperties}>
      <div className="kpi-top">
        <span className="kpi-label">{label}</span>
        <div className="kpi-icon-wrap">{icon}</div>
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-sub">
        <span className={up ? "kpi-up" : "kpi-down"}>{up ? "▲" : "▼"}</span>
        {sub}
      </div>
    </div>
  );
}