import type { ReactNode } from "react";
import "./Card.css";

type Props = {
  headerAction?: ReactNode;
  children?: ReactNode;
};

export default function Card({ headerAction, children }: Props) {
  return (
    <div className="card">
      {headerAction && <div className="card-header">{headerAction}</div>}
      {children && <div className="card-body">{children}</div>}
    </div>
  );
}