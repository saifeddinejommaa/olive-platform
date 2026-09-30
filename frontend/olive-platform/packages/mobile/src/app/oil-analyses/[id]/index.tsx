import { useLocalSearchParams } from "expo-router";
import { OilAnalysisDetailsPage } from "../../../features/oilAnalyses/OilAnalysisDetailsPage";

export default function OilAnalysisDetailsRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) return null;
  return <OilAnalysisDetailsPage analysisId={Number(id)} />;
}
