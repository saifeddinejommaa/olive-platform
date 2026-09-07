import InfoFieldWidget from "../../../../common/widgets/InfoFieldWidget";
import type { PressingOperationInputDetails } from "../../domain/entities/PressingOperationInputDetails";

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
    <div className="filters-content">
      <InfoFieldWidget label="Type" value={sourceType} />

      <InfoFieldWidget label="Référence" value={input.sourceReference || "-"} />

      <InfoFieldWidget label="Quantité" value={formatKg(input.quantityKg)} />
    </div>
  );
}
