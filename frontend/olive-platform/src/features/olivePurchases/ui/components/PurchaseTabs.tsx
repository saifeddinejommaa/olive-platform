import type { PurchaseTab } from "../types/PurchaseTab";

type PurchaseTabsProps = {
  activeTab: PurchaseTab;
  onChange: (tab: PurchaseTab) => void;
};

export default function PurchaseTabs({
  activeTab,
  onChange,
}: PurchaseTabsProps) {
  return (
    <div
      style={{
        display: "flex",
        borderBottom: "1px solid #e5e7eb",
        marginBottom: "20px",
        gap: "5px",
      }}
    >
      <button
        type="button"
        onClick={() => onChange("general")}
        style={{
          border: "none",
          background: activeTab === "general" ? "#fff" : "transparent",
          borderBottom:
            activeTab === "general"
              ? "2px solid #1976d2"
              : "2px solid transparent",
          padding: "12px 18px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: activeTab === "general" ? 600 : 500,
          color: activeTab === "general" ? "#1976d2" : "#6b7280",
          marginBottom: "-1px",
        }}
      >
        Informations générales
      </button>

      <button
        type="button"
        onClick={() => onChange("olives")}
        style={{
          border: "none",
          background: activeTab === "olives" ? "#fff" : "transparent",
          borderBottom:
            activeTab === "olives"
              ? "2px solid #1976d2"
              : "2px solid transparent",
          padding: "12px 18px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: activeTab === "olives" ? 600 : 500,
          color: activeTab === "olives" ? "#1976d2" : "#6b7280",
          marginBottom: "-1px",
        }}
      >
        Olives
      </button>
    </div>
  );
}
