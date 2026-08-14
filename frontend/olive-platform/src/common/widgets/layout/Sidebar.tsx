import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

type MenuItem = {
  label: string;
  path: string;
};

type MenuSection = {
  label: string;
  icon: string;
  items: MenuItem[];
};

const menuSections: MenuSection[] = [
  {
    label: "Achats d'olives",
    icon: "🫒",
    items: [
      {
        label: "Liste des achats",
        path: "/olive-purchases",
      },
      {
        label: "Nouvel achat",
        path: "/olive-purchases/new",
      },
    ],
  },

  {
    label: "Récoltes",
    icon: "🌿",
    items: [
      {
        label: "Liste des récoltes",
        path: "/harvests",
      },
      {
        label: "Nouvelle récolte",
        path: "/harvests/new",
      },
    ],
  },

  {
    label: "Production",
    icon: "⚙️",
    items: [
      {
        label: "Lots de production",
        path: "/production",
      },
      {
        label: "Nouveau lot",
        path: "/production/new",
      },
    ],
  },

  {
    label: "Mouvements d'huile",
    icon: "↔️",
    items: [
      {
        label: "Liste des mouvements",
        path: "/oil-movements",
      },
      {
        label: "Nouveau mouvement",
        path: "/oil-movements/new",
      },
    ],
  },

  {
    label: "Citernes",
    icon: "🛢️",
    items: [
      {
        label: "Liste des citernes",
        path: "/tanks",
      },
      {
        label: "Nouvelle citerne",
        path: "/tanks/new",
      },
    ],
  },

  {
    label: "Paiements",
    icon: "💶",
    items: [
      {
        label: "Liste des paiements",
        path: "/payments",
      },
      {
        label: "Nouveau paiement",
        path: "/payments/new",
      },
    ],
  },

  {
    label: "Factures",
    icon: "🧾",
    items: [
      {
        label: "Liste des factures",
        path: "/invoices",
      },
      {
        label: "Nouvelle facture",
        path: "/invoices/new",
      },
    ],
  },

  {
    label: "Ouvriers",
    icon: "👷",
    items: [
      {
        label: "Liste des ouvriers",
        path: "/workers",
      },
      {
        label: "Nouvel ouvrier",
        path: "/workers/new",
      },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();

  const [openSections, setOpenSections] =
    useState<Record<string, boolean>>({});

  const toggleSection = (label: string) => {
    setOpenSections((previous) => ({
      ...previous,
      [label]: !previous[label],
    }));
  };

  const isSectionActive = (section: MenuSection) => {
    return section.items.some((item) =>
      location.pathname.startsWith(item.path)
    );
  };

  return (
    <aside className="sidebar">

      {/* BRAND */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          🫒
        </div>

        <div>
          <div className="brand-title">
            Olive Platform
          </div>

          <div className="brand-subtitle">
            Gestion de l'huilerie
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="sidebar-nav">

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">
            ⌂
          </span>

          <span>
            Tableau de bord
          </span>
        </NavLink>

        <div className="nav-section-title">
          GESTION
        </div>

        {menuSections.map((section) => {
          const active = isSectionActive(section);

          const isOpen =
            openSections[section.label] ?? active;

          return (
            <div
              key={section.label}
              className="menu-section"
            >
              <button
                type="button"
                className={`menu-parent ${active ? "active-parent" : ""
                  }`}
                onClick={() =>
                  toggleSection(section.label)
                }
              >
                <span className="nav-icon">
                  {section.icon}
                </span>

                <span className="menu-parent-label">
                  {section.label}
                </span>

                <span
                  className={`menu-chevron ${isOpen ? "open" : ""
                    }`}
                >
                  ›
                </span>
              </button>

              {isOpen && (
                <div className="submenu">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end
                      className={({ isActive }) =>
                        `submenu-item ${isActive ? "active" : ""}`
                      }
                    >
                      <span className="submenu-indicator" />

                      <span>
                        {item.label}
                      </span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* SYSTEM */}
      <div className="sidebar-bottom">

        <div className="nav-section-title">
          SYSTÈME
        </div>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">
            ⚙
          </span>

          <span>
            Paramètres
          </span>
        </NavLink>

        <div className="sidebar-version">
          Olive Platform v1.0
        </div>
      </div>

    </aside>
  );
}