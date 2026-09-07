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
  sourceLabel: string;
  analysisDateLabel: string;
  acidityPercentage?: number;
  peroxideIndex?: number;
  k232?: number;
  k270?: number;
  organolepticGrade?: number;
  onClose: () => void;
  onConfirm: () => void;
};

const formatValue = (value?: number, suffix = "") =>
  value !== undefined ? `${value} ${suffix}`.trim() : "-";

export default function CompleteOilAnalysisDrawer({
  open,
  saving,
  reference,
  sourceLabel,
  analysisDateLabel,
  acidityPercentage,
  peroxideIndex,
  k232,
  k270,
  organolepticGrade,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Drawer
      open={open}
      title="Clôturer l'analyse"
      description="Vérifiez les résultats de l'analyse avant de confirmer sa clôture."
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
        <DrawerInfoCard label="Référence de l'analyse">
          {reference || "-"}
        </DrawerInfoCard>

        <DrawerInfoCard label="Source">{sourceLabel || "-"}</DrawerInfoCard>

        <DrawerInfoCard label="Date d'analyse">
          {analysisDateLabel}
        </DrawerInfoCard>

        <DrawerSummarySection
          title="Résultats de l'analyse"
          description="Vérifiez les valeurs avant de confirmer la clôture."
        >
          <DrawerSummaryRow
            label="Acidité"
            value={formatValue(acidityPercentage, "%")}
          />
          <DrawerSummaryRow
            label="Indice de peroxyde"
            value={formatValue(peroxideIndex)}
          />
          <DrawerSummaryRow label="K232" value={formatValue(k232)} />
          <DrawerSummaryRow label="K270" value={formatValue(k270)} />
          <DrawerSummaryRow
            label="Classification organoleptique"
            value={formatValue(organolepticGrade)}
            withBorder={false}
          />
        </DrawerSummarySection>

        <DrawerConfirmationNotice title="Confirmation">
          Une fois l'analyse clôturée, les résultats ne pourront plus être
          modifiés.
        </DrawerConfirmationNotice>
      </div>
    </Drawer>
  );
}
