import { useLocalSearchParams } from "expo-router";
import { NewPressingOperationPage } from "../../features/production/NewPressingOperationPage";

export default function NewPressingOperationRoute() {
  // Récolte présélectionnée (bouton « Lancer la pression » du détail d'une récolte).
  const { harvestId } = useLocalSearchParams<{ harvestId?: string }>();

  return (
    <NewPressingOperationPage
      initialHarvestId={harvestId ? Number(harvestId) : undefined}
    />
  );
}
