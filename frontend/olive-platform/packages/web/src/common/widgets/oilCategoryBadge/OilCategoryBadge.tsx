import type { ReactNode } from "react";
import {
  OIL_CATEGORY_LABELS,
  OilCategory,
} from "@olive-platform/core/features/tanks/domain/entities/Tank";
import "./OilCategoryBadge.css";

// Couleur du badge par catégorie (fixée par l'API, jamais calculée ici).
const CATEGORY_CLASSES: Partial<Record<OilCategory, string>> = {
  [OilCategory.ExtraVirgin]: "extraVirgin",
  [OilCategory.Virgin]: "virgin",
  [OilCategory.Lampante]: "lampante",
};

type Props = {
  // null : catégorie inconnue (en attente d'analyse).
  category: OilCategory | null | undefined;
  // Texte du badge ; par défaut le nom court de la catégorie.
  children?: ReactNode;
};

// Badge coloré de la catégorie d'une huile d'olive.
export default function OilCategoryBadge({ category, children }: Props) {
  const modifier = (category && CATEGORY_CLASSES[category]) ?? "unknown";

  return (
    <span className={`grade-badge grade-badge--${modifier}`}>
      {children ?? (category ? OIL_CATEGORY_LABELS[category] : "En attente d'analyse")}
    </span>
  );
}
