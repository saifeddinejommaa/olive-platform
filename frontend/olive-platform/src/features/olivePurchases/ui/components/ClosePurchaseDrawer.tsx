import Button from "../../../../common/widgets/button/Button";
import Drawer from "../../../../common/widgets/drawer/Drawer";
import DrawerInfoCard from "../../../../common/widgets/drawerInfoCard/DrawerInfoCard";
import type { OlivePurchaseDetails } from "../../domain/entities/OlivePurchaseDetails";
import DrawerConfirmationNotice from "../../../../common/widgets/DrawerConfirmationNotice";
import { formatDate } from "../../../shared/utils/DatesUtils";
import type { OlivePurchaseItemDetails } from "../../domain/entities/OlivePurchaseItemDetails";
import { ProductionStatus } from "../../../production/domain/entities/ProductionStatus";

type Props = {
  open: boolean;
  saving: boolean;
  purchase: OlivePurchaseDetails;
  items: OlivePurchaseItemDetails[];
  onClose: () => void;
  onConfirm: () => void;
};

export default function ClosePurchaseDrawer({
  open,
  saving,
  purchase,
  items,
  onClose,
  onConfirm,
}: Props) {
  const hasPendingAnalysis = items?.some(
    (item) => item.analysis?.status !== ProductionStatus.Completed
  );
  
  return (
    <Drawer
      open={open}
      title="Clôturer l'achat"
      description="Vérifiez les informations de l'achat avant de confirmer sa clôture."
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Annuler
          </Button>

          <Button variant="primary" onClick={onConfirm} disabled={saving}>
            {saving ? "Clôture..." : "Confirmer et clôturer"}
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <DrawerInfoCard label="Référence de l'achat">
          {purchase.reference || "-"}
        </DrawerInfoCard>

        <DrawerInfoCard label="Fournisseur">
          {purchase.supplierName || "-"}
        </DrawerInfoCard>

        <DrawerInfoCard label="Date d'achat">
          {formatDate(purchase.purchaseDate)}
        </DrawerInfoCard>

        <DrawerInfoCard label="Quantité d'olives (kg)">
          {purchase.totalQuantity?.toLocaleString() || "-"}
        </DrawerInfoCard>

        <DrawerInfoCard label="Prix total (dt)">
          {purchase.totalAmount?.toLocaleString() || "-"}
        </DrawerInfoCard>

        <DrawerConfirmationNotice title="Confirmation">
          Une fois l'achat clôturé, il ne pourra plus être modifié.
        </DrawerConfirmationNotice>
        {hasPendingAnalysis && (
          <DrawerConfirmationNotice title="Analyse en attente">
            Cet achat contient au moins une analyse qui n'est pas encore traitée.
            Veuillez la traiter avant de clôturer l'achat.
          </DrawerConfirmationNotice>
        )}
      </div>
    </Drawer>
  );
}
