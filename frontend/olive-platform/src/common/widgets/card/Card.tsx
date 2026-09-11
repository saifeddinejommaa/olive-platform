import type { ReactNode } from "react";
import "./Card.css";

type Props = {
  headerAction?: ReactNode;
  children: ReactNode;
};

export default function Card({children }: Props) {
  return (
    <div className="card">
      {children && <div className="card-body">{children}</div>}
    </div>
  );
}
