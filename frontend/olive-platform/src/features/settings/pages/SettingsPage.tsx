export default function SettingsPage() {
  return (
    <div className="feature-page">

      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">
            Paramètres
          </h1>

          <p className="page-description">
            Configuration de la plateforme.
          </p>
        </div>
      </div>

      <div className="settings-grid">

        <section className="card settings-card">
          <h2>Statuts d’achat</h2>

          <p>
            Gestion des statuts utilisés pour les achats
            d’olives.
          </p>
        </section>

        <section className="card settings-card">
          <h2>Statuts de production</h2>

          <p>
            Gestion des statuts des productions.
          </p>
        </section>

        <section className="card settings-card">
          <h2>Types de mouvements</h2>

          <p>
            Configuration des mouvements de stock d’huile.
          </p>
        </section>

        <section className="card settings-card">
          <h2>Moyens de paiement</h2>

          <p>
            Configuration des moyens de paiement.
          </p>
        </section>

      </div>

    </div>
  )
}