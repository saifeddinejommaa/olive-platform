import { useLocalSearchParams } from "expo-router";
import { HarvestDetailsPage } from "../../../features/harvest/HarvestDetailsPage";

export default function HarvestDetailsRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) return null;
  return <HarvestDetailsPage harvestId={Number(id)} />;
}