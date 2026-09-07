import Button from "../../../../common/widgets/button/Button";
import Drawer from "../../../../common/widgets/drawer/Drawer";
import DrawerInfoCard from "../../../../common/widgets/drawerInfoCard/DrawerInfoCard";
import { renderStatus } from "../../../shared/utils/StatusUtils";
import { purchaseStatusConfig } from "../../../shared/status/PurchaseStatusConfig";
import type { OlivePurchaseDetails } from "../../domain/entities/OlivePurchaseDetails";
import DrawerConfirmationNotice from "../../../../common/widgets/DrawerConfirmationNotice";
import { formatDate } from "../../../shared/utils/DatesUtils";

type Props = {
  open: boolean;
  saving: boolean;
  purchase: OlivePurchaseDetails;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ClosePurchaseDrawer({
  open,
  saving,
  purchase,
  onClose,
  onConfirm,
}: Props) {
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

        <DrawerInfoCard label="Statut actuel">
          {renderStatus(purchase.status, purchaseStatusConfig)}
        </DrawerInfoCard>

        <DrawerConfirmationNotice title="Confirmation">
          Une fois l'achat clôturé, il ne pourra plus être modifié.
        </DrawerConfirmationNotice>
      </div>
    </Drawer>
  );
}
