import { useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";

import { useOliveAnalysesStore } from "@olive-platform/core/features/analyses/oliveAnalyses/store/OliveAnalysesStore";
import { ListScreen } from "../../components/ListScreen";
import {
  countActiveFilters,
  FilterDateField,
  FilterTextField,
} from "../../components/filters/FilterFields";
import { ProductionStatusFilterField } from "../../components/filters/ProductionStatusFilterField";

import { OliveAnalysisListItem } from "./widgets/OliveAnalysisListItem";

export const OliveAnalysesPage = () => {
  const router = useRouter();

  const { analyses, loading, error, filter, setParams, fetchAnalyses, clear } =
    useOliveAnalysesStore();

  const applyFilters = () => {
    fetchAnalyses({ pageNumber: 1 });
  };

  const resetFilters = () => {
    clear();
    fetchAnalyses({ pageNumber: 1, pageSize: 10 });
  };

  // Rechargé à chaque retour sur l'écran (ex. après une analyse terminée).
  useFocusEffect(
    useCallback(() => {
      fetchAnalyses();
    }, [fetchAnalyses]),
  );

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
      onApplyFilters={applyFilters}
      onResetFilters={resetFilters}
      activeFilterCount={countActiveFilters([
        filter.reference,
        filter.harvestReference,
        filter.purchaseReference,
        filter.fromDate,
        filter.toDate,
        filter.status,
      ])}
      filterContent={
        <>
          <FilterTextField
            label="Référence"
            placeholder="OLIV_ANALYSE-2026-001"
            value={filter.reference}
            onChangeText={(value) => setParams({ reference: value })}
          />
          <FilterTextField
            label="Réf. récolte"
            placeholder="HARV-2026-001"
            value={filter.harvestReference}
            onChangeText={(value) => setParams({ harvestReference: value })}
          />
          <FilterTextField
            label="Réf. achat"
            placeholder="Réf. de l'achat"
            value={filter.purchaseReference}
            onChangeText={(value) => setParams({ purchaseReference: value })}
          />
          <FilterDateField
            label="Début à partir du"
            value={filter.fromDate}
            onChange={(value) => setParams({ fromDate: value })}
          />
          <FilterDateField
            label="Fin jusqu'au"
            value={filter.toDate}
            onChange={(value) => setParams({ toDate: value })}
          />
          <ProductionStatusFilterField
            value={filter.status}
            onChange={(value) => setParams({ status: value })}
          />
        </>
      }
    />
  );
};