import { useLocalSearchParams } from "expo-router";
import { PlotDetailsPage } from "../../../features/plots/PlotDetailsPage";

export default function PlotDetailsRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) return null;
  return <PlotDetailsPage plotId={Number(id)} />;
}
