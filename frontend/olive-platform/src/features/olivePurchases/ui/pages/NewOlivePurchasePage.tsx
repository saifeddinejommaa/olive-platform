import { useNavigate } from 'react-router-dom'

export default function NewOlivePurchasePage() {
  const navigate = useNavigate()

  return (
    <div className="feature-page">

      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">
            Nouvel achat d’olives
          </h1>

          <p className="page-description">
            Enregistrer un nouvel achat auprès d’un fournisseur.
          </p>
        </div>
      </div>

      <div className="card form-card">

        <div className="form-grid">

          <div className="form-field">
            <label>Numéro d’achat</label>
            <input placeholder="ACH-2026-001" />
          </div>

          <div className="form-field">
            <label>Fournisseur</label>
            <input placeholder="Nom du fournisseur" />
          </div>

          <div className="form-field">
            <label>Date d’achat</label>
            <input type="date" />
          </div>

          <div className="form-field">
            <label>Statut</label>

            <select defaultValue="draft">
              <option value="draft">Brouillon</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvé</option>
            </select>
          </div>

        </div>

        <div className="form-field">
          <label>Notes</label>
          <textarea rows={4} />
        </div>

        <div className="form-actions">
          <button
            className="secondary-button"
            onClick={() => navigate('/olive-purchases')}
          >
            Annuler
          </button>

          <button className="primary-button">
            Enregistrer
          </button>
        </div>

      </div>
    </div>
  )
}