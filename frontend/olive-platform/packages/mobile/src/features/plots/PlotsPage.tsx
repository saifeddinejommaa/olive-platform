import { useEffect } from "react";
import { useRouter } from "expo-router";

import { usePlotsStore } from "@olive-platform/core/features/plots/stores/UsePlotsStore";
import { ListScreen } from "../../components/ListScreen";

import { PlotListItem } from "./widgets/PlotListItem";

export const PlotsPage = () => {
  const router = useRouter();

  const { Plots, loading, error, fetchPlots } = usePlotsStore();

  useEffect(() => {
    fetchPlots();
  }, [fetchPlots]);

  return (
    <ListScreen
      title="Parcelles"
      canCreate = {false}
      description="Gérez vos parcelles"
      data={Plots?.items ?? []}
      keyExtractor={(item) => item.id.toString()}
      onCreate={() => {
        console.log("Créer une parcelle");
      }}
      renderItem={({ item }) => (
        <PlotListItem
          plot={item}
          onPress={(plot) =>
            router.push({
              pathname: "/plots/[id]",
              params: {
                id: plot.id.toString(),
              },
            })
          }
        />
      )}
      emptyTitle={
        loading
          ? "Chargement..."
          : error
            ? "Impossible de charger les parcelles"
            : "Aucune parcelle"
      }
      emptyDescription={
        error ?? "Aucune parcelle ne correspond aux filtres actuels."
      }
      filterContent={<></>}
    />
  );
};