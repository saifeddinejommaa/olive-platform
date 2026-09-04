import Button from "../../../../../common/widgets/button/Button";
import Drawer from "../../../../../common/widgets/drawer/Drawer";
import DrawerConfirmationNotice from "../../../../../common/widgets/DrawerConfirmationNotice";
import DrawerInfoCard from "../../../../../common/widgets/drawerInfoCard/DrawerInfoCard";
import DrawerSummaryRow from "../../../../../common/widgets/DrawerSummaryRow";
import DrawerSummarySection from "../../../../../common/widgets/DrawerSummarySection";

type Props = {
  open: boolean;
  saving: boolean;
  reference: string;
  sourceTypeLabel: string;
  sourceReferenceLabel: string;
  sourceReferenceValue: string;
  varietyLabel: string;
  analysisDateLabel: string;
  humidityPercentage?: number;
  waterPercentage?: number;
  oilPercentage?: number;
  acidityPercentage?: number;
  onClose: () => void;
  onConfirm: () => void;
};

const formatPercentage = (value?: number) => (value !== undefined ? `${value} %` : "-");

export default function CompleteOliveAnalysisDrawer({
  open,
  saving,
  reference,
  sourceTypeLabel,
  sourceReferenceLabel,
  sourceReferenceValue,
  varietyLabel,
  analysisDateLabel,
  humidityPercentage,
  waterPercentage,
  oilPercentage,
  acidityPercentage,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Drawer
      open={open}
      title="Clôturer l'analyse"
      description="Vérifiez les informations et les résultats de l'analyse avant de confirmer sa clôture."
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
        <DrawerInfoCard label="Référence de l'analyse">{reference || "-"}</DrawerInfoCard>

        <DrawerInfoCard label="Type de source">{sourceTypeLabel}</DrawerInfoCard>

        <DrawerInfoCard label={sourceReferenceLabel}>
          {sourceReferenceValue || "-"}
        </DrawerInfoCard>

        <DrawerInfoCard label="Variété">{varietyLabel}</DrawerInfoCard>

        <DrawerInfoCard label="Date d'analyse">{analysisDateLabel}</DrawerInfoCard>

        <DrawerSummarySection
          title="Résultats de l'analyse"
          description="Vérifiez les valeurs avant de confirmer la clôture."
        >
          <DrawerSummaryRow label="Humidité" value={formatPercentage(humidityPercentage)} />
          <DrawerSummaryRow label="Eau" value={formatPercentage(waterPercentage)} />
          <DrawerSummaryRow label="Huile" value={formatPercentage(oilPercentage)} />
          <DrawerSummaryRow
            label="Acidité"
            value={formatPercentage(acidityPercentage)}
            withBorder={false}
          />
        </DrawerSummarySection>

        <DrawerConfirmationNotice title="Confirmation">
          Une fois l'analyse clôturée, les résultats ne pourront plus être modifiés.
        </DrawerConfirmationNotice>
      </div>
    </Drawer>
  );
}
