import type { ReactNode } from "react";
import { createPortal } from "react-dom";

type Props = {
  // Emplacement cible (ex. ligne pleine largeur d'une carte). Absent : rendu sur place.
  container?: HTMLElement | null;
  children: ReactNode;
};

// Affiche son contenu ailleurs dans la page, sans perdre l'état du composant parent.
export default function ListSlot({ container, children }: Props) {
  return container ? createPortal(children, container) : <>{children}</>;
}
