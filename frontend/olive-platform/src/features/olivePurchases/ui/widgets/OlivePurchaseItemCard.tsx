import { useState } from "react";
import OlivePurchaseItemInfo from "./OlivePurchaseItemInfo";
import OliveAnalysisInfoWidget from "./OliveAnalysisInfoWidget";
import type { OlivePurchaseItemDetails } from "../../domain/entities/OlivePurchaseItemDetails";

type Props = {
  item: OlivePurchaseItemDetails;
};

export default function OlivePurchaseItemCardWidget({ item }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        gridColumn: "1 / -1",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: expanded ? "16px" : "0",
      }}
    >
      <button
        type="button"
        onClick={() => setExpanded((previous) => !previous)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{ fontWeight: 600, fontSize: "14px" }}>
          {item.reference} — {item.variety}
        </span>

        <span
          style={{
            display: "inline-block",
            transition: "transform 0.15s ease",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▼
        </span>
      </button>

      {expanded && (
        <>
          <OlivePurchaseItemInfo item={item} />

          {item.analysis && (
            <div style={{ borderTop: "1px solid #eee", paddingTop: "16px" }}>
              <OliveAnalysisInfoWidget analysis={item.analysis} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
