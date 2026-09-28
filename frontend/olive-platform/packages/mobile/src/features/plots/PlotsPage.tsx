import { useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";

import { usePlotsStore } from "@olive-platform/core/features/plots/stores/UsePlotsStore";
import { getPlotHarvestStateOptions } from "@olive-platform/core/features/plots/domain/entities/PlotHarvestState";
import { ListScreen } from "../../components/ListScreen";
import {
  countActiveFilters,
  FilterChoiceField,
  FilterTextField,
} from "../../components/filters/FilterFields";

import { PlotListItem } from "./widgets/PlotListItem";

export const PlotsPage = () => {
  const router = useRouter();

  const {
    Plots,
    loading,
    error,
    filters,
    setFilter,
    clearFilters,
    fetchPlots,
  } = usePlotsStore();

  // Rechargé à chaque retour sur l'écran (ex. après une récolte lancée).
  useFocusEffect(
    useCallback(() => {
      fetchPlots();
    }, [fetchPlots]),
  );

  const applyFilters = () => {
    setFilter("pageNumber", 1);
    fetchPlots();
  };

  const resetFilters = () => {
    clearFilters();
    fetchPlots();
  };

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
      onApplyFilters={applyFilters}
      onResetFilters={resetFilters}
      activeFilterCount={countActiveFilters([
        filters.reference,
        filters.name,
        filters.harvestState,
      ])}
      filterContent={
        <>
          <FilterTextField
            label="Référence"
            placeholder="PLOT-001"
            value={filters.reference}
            onChangeText={(value) => setFilter("reference", value)}
          />
          <FilterTextField
            label="Nom de la parcelle"
            placeholder="Lahmeda"
            value={filters.name}
            onChangeText={(value) => setFilter("name", value)}
          />
          <FilterChoiceField
            label="État de récolte (campagne)"
            allLabel="Toutes"
            options={getPlotHarvestStateOptions()}
            value={filters.harvestState}
            onChange={(value) => setFilter("harvestState", value)}
          />
        </>
      }
    />
  );
};