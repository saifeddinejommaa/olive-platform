import type { ReactNode } from "react";
import {
  OIL_GRADE_LABELS,
  type OilGrade,
} from "@olive-platform/core/features/oilQuality/OilGrade";
import "./OilGradeBadge.css";

type Props = {
  // null : catégorie inconnue (en attente d'analyse).
  grade: OilGrade | null;
  // Texte du badge ; par défaut le nom de la catégorie.
  children?: ReactNode;
};

// Badge coloré de la catégorie d'une huile d'olive.
export default function OilGradeBadge({ grade, children }: Props) {
  return (
    <span className={`grade-badge grade-badge--${grade ?? "unknown"}`}>
      {children ?? (grade ? OIL_GRADE_LABELS[grade] : "En attente d'analyse")}
    </span>
  );
}
