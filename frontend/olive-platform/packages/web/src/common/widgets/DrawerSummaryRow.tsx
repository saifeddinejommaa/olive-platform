type Props = {
  label: string;
  value: string;
  withBorder?: boolean;
};

export default function DrawerSummaryRow({
  label,
  value,
  withBorder = true,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 0",
        borderBottom: withBorder ? "1px solid #e5e7eb" : undefined,
      }}
    >
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
