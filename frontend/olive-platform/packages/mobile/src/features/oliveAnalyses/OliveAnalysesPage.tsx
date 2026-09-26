import { useEffect } from "react";
import { useRouter } from "expo-router";

import { useOliveAnalysesStore } from "@olive-platform/core/features/analyses/oliveAnalyses/store/OliveAnalysesStore";
import { ListScreen } from "../../components/ListScreen";

import { OliveAnalysisListItem } from "./widgets/OliveAnalysisListItem";

export const OliveAnalysesPage = () => {
  const router = useRouter();

  const { analyses, loading, error, fetchAnalyses } = useOliveAnalysesStore();

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  return (
    <ListScreen
      title="Analyses"
      description="Suivez les analyses d'olives"
      data={analyses}
      keyExtractor={(item) => item.id.toString()}
      onCreate={() => {
        console.log("Créer une analyse");
      }}
      renderItem={({ item }) => (
        <OliveAnalysisListItem
          analysis={item}
          onPress={(analysis) =>
            router.push({
              pathname: "/analyses/[id]",
              params: {
                id: analysis.id.toString(),
              },
            })
          }
        />
      )}
      emptyTitle={
        loading
          ? "Chargement..."
          : error
            ? "Impossible de charger les analyses"
            : "Aucune analyse"
      }
      emptyDescription={
        error ?? "Aucune analyse ne correspond aux filtres actuels."
      }
      filterContent={<></>}
    />
  );
};