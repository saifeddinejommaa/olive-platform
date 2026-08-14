import './DashboardPage.css'

const stats = [
  {
    label: 'Achats d’olives',
    value: '0',
    description: 'Achats enregistrés',
  },
  {
    label: 'Production',
    value: '0 L',
    description: 'Huile produite',
  },
  {
    label: 'Stock huile',
    value: '0 L',
    description: 'Stock disponible',
  },
  {
    label: 'Dépenses',
    value: '0 €',
    description: 'Total des paiements',
  },
]

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">
            Tableau de bord
          </h1>

          <p className="page-description">
            Vue d’ensemble de votre activité oléicole.
          </p>
        </div>
      </div>

      <div className="dashboard-stats">
        {stats.map((stat) => (
          <div className="dashboard-stat card" key={stat.label}>
            <span className="dashboard-stat-label">
              {stat.label}
            </span>

            <strong className="dashboard-stat-value">
              {stat.value}
            </strong>

            <span className="dashboard-stat-description">
              {stat.description}
            </span>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="card dashboard-panel">
          <h2>Activité récente</h2>

          <p className="empty-state">
            Aucune activité récente.
          </p>
        </section>

        <section className="card dashboard-panel">
          <h2>Stock d’huile</h2>

          <p className="empty-state">
            Aucune donnée de stock disponible.
          </p>
        </section>
      </div>
    </div>
  )
}