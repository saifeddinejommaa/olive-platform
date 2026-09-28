import InfoFieldWidget from "../../../../common/widgets/InfoFieldWidget";
import type { PressingOperationInputDetails } from "@olive-platform/core/features/production/domain/entities/PressingOperationInputDetails";

type Props = {
  input: PressingOperationInputDetails;
};

const formatKg = (value: number | null | undefined) =>
  value !== null && value !== undefined
    ? `${value.toLocaleString("fr-FR")} kg`
    : "-";

export default function PressingOperationOliveInfo({ input }: Props) {
  const sourceType = input.sourceType === "harvest" ? "Récolte" : "Achat";

  return (
    <div className="info-grid">
      <InfoFieldWidget label="Type" value={sourceType} />

      <InfoFieldWidget label="Référence" value={input.sourceReference || "-"} />

      <InfoFieldWidget label="Lot" value={input.lotReference || "-"} />

      <InfoFieldWidget label="Quantité pressée" value={formatKg(input.quantityKg)} />

      <InfoFieldWidget label="Quantité du lot" value={formatKg(input.lotQuantityKg)} />
    </div>
  );
}
