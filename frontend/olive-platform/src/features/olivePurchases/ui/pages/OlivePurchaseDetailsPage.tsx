import { useNavigate, useParams } from 'react-router-dom'

export default function OlivePurchaseDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div className="feature-page">

      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">
            Détail de l’achat
          </h1>

          <p className="page-description">
            Achat #{id}
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={() => navigate('/olive-purchases')}
        >
          Retour
        </button>
      </div>

      <div className="card details-card">

        <div className="details-grid">
          <div>
            <span>Numéro</span>
            <strong>—</strong>
          </div>

          <div>
            <span>Fournisseur</span>
            <strong>—</strong>
          </div>

          <div>
            <span>Date</span>
            <strong>—</strong>
          </div>

          <div>
            <span>Statut</span>
            <strong>—</strong>
          </div>

          <div>
            <span>Quantité totale</span>
            <strong>0 kg</strong>
          </div>

          <div>
            <span>Montant total</span>
            <strong>0 €</strong>
          </div>
        </div>

      </div>

      <div className="card details-card">
        <h2>Articles</h2>

        <p className="empty-state">
          Aucun article.
        </p>
      </div>

      <div className="card details-card">
        <h2>Échantillons</h2>

        <p className="empty-state">
          Aucun échantillon.
        </p>
      </div>

    </div>
  )
}