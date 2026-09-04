type Props = {
  label: string;
  value: string;
  fullWidth?: boolean;
};

export default function InfoFieldWidget({ label, value, fullWidth }: Props) {
  return (
    <div className="filter-item" style={fullWidth ? { gridColumn: "1 / -1" } : undefined}>
      <span className="filter-item-label">{label}</span>
      <span className="filter-item-value">{value}</span>
    </div>
  );
}
