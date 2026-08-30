import { useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/": "Tableau de bord",
  "/olive-purchases": "Achats d'olives",
  "/payments": "Paiements",
  "/tanks": "Citernes",
  "/workers": "Ouvriers",
  "/harvests": "Récoltes",
  "/production": "Production",
  "/oil-movements": "Mouvements d'huile",
  "/invoices": "Factures",
  "/settings": "Paramètres",
};

export default function Topbar() {
  const location = useLocation();

  const title =
    Object.entries(pageTitles).find(([path]) =>
      path === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(path),
    )?.[1] ?? "Olive Platform";

  return (
    <header className="topbar">
      <div>
        <h1 className="topbar-title">{title}</h1>

        <div className="topbar-breadcrumb">Olive Platform / {title}</div>
      </div>

      <div className="topbar-actions">
        <button type="button" className="topbar-button" title="Notifications">
          🔔
        </button>

        <div className="user-profile">
          <div className="user-avatar">SJ</div>

          <div className="user-info">
            <strong>Administrateur</strong>
            <span>Gestionnaire</span>
          </div>
        </div>
      </div>
    </header>
  );
}
