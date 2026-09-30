import { useLocalSearchParams } from "expo-router";
import { NewHarvestPage } from "../../features/harvest/NewHarvestPage";

// ?plotId= : parcelle présélectionnée (« Lancer une récolte » depuis une parcelle).
export default function NewHarvestRoute() {
  const { plotId } = useLocalSearchParams<{ plotId?: string }>();
  return <NewHarvestPage initialPlotId={plotId ? Number(plotId) : null} />;
}
