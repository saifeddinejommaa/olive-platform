import { NavLink } from "react-router-dom";

type MenuItem = {
  label: string;
  icon: string;
  path: string;
};

const menuItems: MenuItem[] = [
  { label: "Parcelles", icon: "ti-map-2", path: "/plots" },
  { label: "Achats d'olives", icon: "ti-shopping-cart", path: "/olive-purchases" },
  { label: "Récoltes", icon: "ti-basket", path: "/harvests" },
  { label: "Production", icon: "ti-droplet", path: "/production" },
  { label: "Analyses d'olive", icon: "ti-flask", path: "/Olive-analyses" },
  { label: "Analyses d'huile", icon: "ti-flask-2", path: "/Oil-analyses" },
  { label: "Mouvements d'huile", icon: "ti-arrows-exchange", path: "/oil-movements" },
  { label: "Citernes", icon: "ti-building-warehouse", path: "/tanks" },
  { label: "Paiements", icon: "ti-cash", path: "/payments" },
  { label: "Factures", icon: "ti-file-invoice", path: "/invoices" },
  { label: "Ouvriers", icon: "ti-users", path: "/workers" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <i className="ti ti-leaf" aria-hidden="true"></i>
        </div>

        <div>
          <div className="brand-title">Olive Platform</div>
          <div className="brand-subtitle">Gestion de l'huilerie</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <i className="ti ti-layout-dashboard nav-icon" aria-hidden="true"></i>
          <span>Tableau de bord</span>
        </NavLink>

        <div className="nav-section-title">GESTION</div>

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <i className={`ti ${item.icon} nav-icon`} aria-hidden="true"></i>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="nav-section-title">SYSTÈME</div>

        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <i className="ti ti-settings nav-icon" aria-hidden="true"></i>
          <span>Paramètres</span>
        </NavLink>

        <div className="sidebar-version">Olive Platform v1.0</div>
      </div>
    </aside>
  );
}