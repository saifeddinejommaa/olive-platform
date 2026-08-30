import type { ReactNode } from "react";
import Button from "../button/Button";
import "./Drawer.css";

type DrawerProps = {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  width?: number | string;
};

export default function Drawer({
  open,
  title,
  description,
  children,
  onClose,
  footer,
  width = 420,
}: DrawerProps) {
  if (!open) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside
        className="drawer"
        style={{ width }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="drawer-header">
          <div>
            <h2 className="drawer-title">{title}</h2>

            {description && <p className="drawer-description">{description}</p>}
          </div>

          <Button variant="secondary" onClick={onClose}>
            ×
          </Button>
        </div>

        <div className="drawer-content">{children}</div>

        {footer && <div className="drawer-footer">{footer}</div>}
      </aside>
    </div>
  );
}
