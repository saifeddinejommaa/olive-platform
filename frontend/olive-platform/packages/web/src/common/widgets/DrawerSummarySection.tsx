import type { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function DrawerSummarySection({
  title,
  description,
  children,
}: Props) {
  return (
    <div
      style={{
        padding: "16px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        background: "#fafafa",
      }}
    >
      <div style={{ marginBottom: "16px" }}>
        <strong>{title}</strong>
        <div style={{ marginTop: "4px", fontSize: "13px", color: "#6b7280" }}>
          {description}
        </div>
      </div>

      {children}
    </div>
  );
}
