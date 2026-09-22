import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export default function DrawerConfirmationNotice({ title, children }: Props) {
  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "8px",
        background: "#fff8e1",
        border: "1px solid #f0d98c",
      }}
    >
      <strong>{title}</strong>
      <div style={{ marginTop: "6px", fontSize: "13px" }}>{children}</div>
    </div>
  );
}
