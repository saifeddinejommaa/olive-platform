import type { ReactNode } from "react";
import "./Card.css";

type Props = {
  title?: ReactNode;
  headerAction?: ReactNode;
  children: ReactNode;
};

export default function Card({ title, headerAction, children }: Props) {
  return (
    <div className="card">
      {(title || headerAction) && (
        <div className="card-header">
          {title && <span className="card-title">{title}</span>}
          {headerAction}
        </div>
      )}

      {children && <div className="card-body">{children}</div>}
    </div>
  );
}
