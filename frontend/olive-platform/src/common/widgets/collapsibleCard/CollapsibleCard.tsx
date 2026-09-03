import { useState } from "react";
import type { ReactNode } from "react";
import Card from "../card/Card";
import "./CollapsibleCard.css";

type Props = {
  title: ReactNode;
  children: ReactNode;
  defaultExpanded?: boolean;
};

export default function CollapsibleCard({ title, children, defaultExpanded = false }: Props) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const chevron = (
    <button
      type="button"
      onClick={() => setExpanded((previous) => !previous)}
      className="collapsible-card-toggle"
      aria-label={expanded ? "Réduire" : "Développer"}
    >
      <span
        className={`collapsible-card-chevron ${
          expanded ? "collapsible-card-chevron--expanded" : ""
        }`}
      >
        ▼
      </span>
    </button>
  );

  if (!expanded) {
    return <Card title={title} headerAction={chevron} children={null} />;
  }

  return (
    <Card title={title} headerAction={chevron}>
      {children}
    </Card>
  );
}
