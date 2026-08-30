import { useNavigate } from "react-router-dom";

import Button from "../../../../common/widgets/button/Button";
import TextInput from "../../../../common/widgets/textInput/TextInput";
import Select from "../../../../common/widgets/select/Select";

export default function NewOlivePurchasePage() {
  const navigate = useNavigate();

  return (
    <div className="feature-page">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Nouvel achat d’olives</h1>

          <p className="page-description">
            Enregistrer un nouvel achat auprès d’un fournisseur.
          </p>
        </div>
      </div>

      {/* =====================================================
          FORM
          ===================================================== */}

      <div className="glass-card form-card">
        <div className="form-grid">
          {/* Numéro d'achat */}

          <TextInput label="Numéro d’achat" placeholder="ACH-2026-001" />

          {/* Fournisseur */}

          <TextInput label="Fournisseur" placeholder="Nom du fournisseur" />

          {/* Date */}

          <TextInput label="Date d’achat" type="date" />

          {/* Statut */}

          <Select
            label="Statut"
            defaultValue="draft"
            options={[
              {
                value: "draft",
                label: "Brouillon",
              },
              {
                value: "pending",
                label: "En attente",
              },
              {
                value: "approved",
                label: "Approuvé",
              },
            ]}
          />
        </div>

        {/* Notes */}

        <div className="form-field">
          <label htmlFor="purchase-notes">Notes</label>

          <textarea
            id="purchase-notes"
            rows={4}
            placeholder="Ajouter une note..."
          />
        </div>

        {/* Actions */}

        <div className="form-actions">
          <Button
            variant="secondary"
            onClick={() => navigate("/olive-purchases")}
          >
            Annuler
          </Button>

          <Button variant="primary">Enregistrer</Button>
        </div>
      </div>
    </div>
  );
}
