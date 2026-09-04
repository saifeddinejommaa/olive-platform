import type { ReactNode } from "react";

type Props = {
  label: string;
  children: ReactNode;
};

export default function DrawerInfoCard({ label, children }: Props) {
  return (
    <div style={{ padding: "16px", borderRadius: "8px", background: "#f8f9fa" }}>
      <strong>{label}</strong>
      <div style={{ marginTop: "4px" }}>{children}</div>
    </div>
  );
}
