import { useLocalSearchParams } from "expo-router";
import { HarvestDetailsPage } from "../../../features/harvest/HarvestDetailsPage";
import { PressingOperationDetailsPage } from "../../../features/production/PressingOperationDetails";

export default function HarvestDetailsRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) return null;
  return <PressingOperationDetailsPage operationId={Number(id)} />;
}