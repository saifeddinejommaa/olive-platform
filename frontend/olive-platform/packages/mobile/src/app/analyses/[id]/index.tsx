import { useLocalSearchParams } from "expo-router";
import { OliveAnalysisDetailsPage } from "../../../features/oliveAnalyses/OliveAnalysisDetailsPage";

export default function OliveAnalysisDetailsRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) return null;
  return <OliveAnalysisDetailsPage analysisId={Number(id)} />;
}
