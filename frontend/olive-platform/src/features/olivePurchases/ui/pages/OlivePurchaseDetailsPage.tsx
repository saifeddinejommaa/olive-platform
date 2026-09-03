import { useNavigate, useParams } from "react-router-dom";
import type { PurchaseTab } from "../types/PurchaseTab";
import { useEffect, useState } from "react";
import { useOlivePurchaseDetailsStore } from "../stores/OlivePurchaseDetailsStore";
import { useOlivePurchaseItemsStore } from "../stores/OlivePurchaseItemsStore";
import { renderStatus } from "../../../shared/utils/StatusUtils";
import { purchaseStatusConfig } from "../../../shared/status/PurchaseStatusConfig";
import { PurchaseStatus } from "../../domain/entities/PurchaseStatus";
import Button from "../../../../common/widgets/button/Button";
import PurchaseTabs from "../components/PurchaseTabs";
import OlivePurchaseGeneralTab from "../components/OlivePurchaseGeneralTab";
import OlivePurchaseItemsTab from "../components/OlivePurchaseItemsTab";
import ClosePurchaseDrawer from "../components/ClosePurchaseDrawer";

export default function OlivePurchaseDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<PurchaseTab>("general");
  const [closeDrawerOpen, setCloseDrawerOpen] = useState(false);

  const { details, saving, fetchPurchase, validate, clear } =
    useOlivePurchaseDetailsStore();

  const { fetchItems, clear: clearItems } = useOlivePurchaseItemsStore();

  const isDraft = details?.status === PurchaseStatus.Draft;
  const isPending = details?.status === PurchaseStatus.Pending;

  useEffect(() => {
    if (!id) return;
    fetchPurchase(Number(id));
  }, [id, fetchPurchase]);

  useEffect(() => {
    if (!id || activeTab !== "olives") return;
    fetchItems(Number(id));
  }, [id, activeTab, fetchItems]);

  useEffect(() => {
    return () => {
      clear();
      clearItems();
    };
  }, [clear, clearItems]);

  const handleConfirmClose = async () => {
    await validate(Number(id));
    setCloseDrawerOpen(false);
  };

  return (
    <div className="feature-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Achat d'olives {details?.reference}</h1>
          {details && renderStatus(details.status, purchaseStatusConfig)}
        </div>

        {isDraft && (
          <Button variant="primary" onClick={() => validate(Number(id))} disabled={saving}>
            {saving ? "Lancement..." : "Lancer l'étude"}
          </Button>
        )}

        {isPending && (
          <Button variant="primary" onClick={() => setCloseDrawerOpen(true)} disabled={saving}>
            Clôturer l'achat
          </Button>
        )}
      </div>

      <PurchaseTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "general" && details && (
        <OlivePurchaseGeneralTab purchase={details} onNotesChange={() => {}} />
      )}
      {activeTab === "olives" && <OlivePurchaseItemsTab purchaseId={Number(id)} />}

      <div className="filters-footer">
        <Button variant="secondary" onClick={() => navigate("/Olive-purchases")}>
          Retour
        </Button>
      </div>

      {details && (
        <ClosePurchaseDrawer
          open={closeDrawerOpen}
          saving={saving}
          purchase={details}
          onClose={() => setCloseDrawerOpen(false)}
          onConfirm={handleConfirmClose}
        />
      )}
    </div>
  );
}
