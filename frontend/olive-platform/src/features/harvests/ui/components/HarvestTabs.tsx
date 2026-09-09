export type HarvestTab = "general" | "olives";

type HarvestTabsProps = {
  activeTab: HarvestTab;
  onChange: (tab: HarvestTab) => void;
};

export default function HarvestTabs({ activeTab, onChange }: HarvestTabsProps) {
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
            activeTab === "general" ? "2px solid #1976d2" : "2px solid transparent",
          padding: "12px 18px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: activeTab === "general" ? 600 : 500,
          color: activeTab === "general" ? "#1976d2" : "#6b7280",
          marginBottom: "-1px",
        }}
      >
        Général
      </button>

      <button
        type="button"
        onClick={() => onChange("olives")}
        style={{
          border: "none",
          background: activeTab === "olives" ? "#fff" : "transparent",
          borderBottom:
            activeTab === "olives" ? "2px solid #1976d2" : "2px solid transparent",
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
