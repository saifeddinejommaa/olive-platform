import { Autocomplete } from "../../../../common/widgets/autoComplete/AutoComplete";
import { useHarvestsAutocomplete } from "../../../harvests/ui/hooks/UseHarvestsAutoComplete";
import type { Harvest } from "../../../harvests/domain/entities/Harvest";
import type { SourceOption } from "../../../production/ui/widgets/SourceReference";

type Props = {
  onSelect: (source: SourceOption) => void;
};

export default function HarvestAutoCompleteWidget({ onSelect }: Props) {
  const handleSelect = (harvest: Harvest) => {
    onSelect({
      id: harvest.id,
      reference: harvest.reference,
      quantityKg: harvest.quantityKg,
    });
  };

  return (
    <Autocomplete
      useSearch={useHarvestsAutocomplete}
      getLabel={(harvest) => harvest.reference}
      onSelect={handleSelect}
      placeholder="Rechercher une récolte..."
      width={400}
    />
  );
}
