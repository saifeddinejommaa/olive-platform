// src/features/production/olivePurchases/presentation/pages/OlivePurchaseDetailsPage.tsx

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
import { usePageTitle } from "../../../../common/hooks/usePageTitle";

export default function OlivePurchaseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<PurchaseTab>("general");
  const [closeDrawerOpen, setCloseDrawerOpen] = useState(false);

  const { details, saving, fetchPurchase, validate, clear, launchPressing } =
    useOlivePurchaseDetailsStore();

  const { fetchItems, clear: clearItems, items } = useOlivePurchaseItemsStore();

  const isDraft = details?.status === PurchaseStatus.Draft;
  const isPending = details?.status === PurchaseStatus.Pending;

  usePageTitle(
    details ? `Achat d'olives ${details.reference}` : undefined,
    details ? `N° ${details.reference}` : undefined,
  );

  useEffect(() => {
    if (!id) return;
    fetchPurchase(Number(id));
  }, [id, fetchPurchase]);

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

  const handleOpenCloseDrawer = async () => {
    if (details) {
      await fetchItems(details.id);
      setCloseDrawerOpen(true);
    }
  };

  return (
    <div className="feature-page">
      <div className="section-header">
        {details && renderStatus(details.status, purchaseStatusConfig)}

        <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
          {isDraft && (
            <Button
              variant="primary"
              onClick={() => validate(Number(id))}
              disabled={saving}
            >
              {saving ? "Lancement..." : "Lancer l'étude"}
            </Button>
          )}

          {isPending && (
            <Button
              variant="primary"
              onClick={handleOpenCloseDrawer}
              disabled={saving}
            >
              Clôturer l'achat
            </Button>
          )}

          {details?.canBePressed && (
            <Button
              variant="primary"
              onClick={() => launchPressing(Number(id))}
              disabled={saving}
            >
              {saving ? "Lancement..." : "Lancer une pression"}
            </Button>
          )}
        </div>
      </div>

      <PurchaseTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "general" && details && (
        <OlivePurchaseGeneralTab purchase={details} onNotesChange={() => {}} />
      )}

      {activeTab === "olives" && (
        <OlivePurchaseItemsTab purchaseId={Number(id)} />
      )}

      {details && (
        <ClosePurchaseDrawer
          open={closeDrawerOpen}
          saving={saving}
          purchase={details}
          items={items}
          onClose={() => setCloseDrawerOpen(false)}
          onConfirm={handleConfirmClose}
        />
      )}
    </div>
  );
}