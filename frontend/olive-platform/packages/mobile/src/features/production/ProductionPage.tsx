import { useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";

import { usePressingOperationsStore } from "@olive-platform/core/features/production/stores/pressingOperationStore";
import { ListScreen } from "../../components/ListScreen";
import {
  countActiveFilters,
  FilterDateField,
  FilterTextField,
} from "../../components/filters/FilterFields";


import { PressingOperationListItem } from "./widgets/PressingOperationListItem";

export const ProductionPage = () => {
  const router = useRouter();

  const {
    PressingOperations,
    loading,
    error,
    filters,
    setFilter,
    clearFilters,
    fetchPressingOperations
  } = usePressingOperationsStore();

  const applyFilters = () => {
    setFilter("pageNumber", 1);
    fetchPressingOperations();
  };

  const resetFilters = () => {
    clearFilters();
    fetchPressingOperations();
  };

  // Rechargé à chaque retour sur l'écran. Ne pas dépendre des données
  // chargées : chaque chargement les remplace et relancerait l'effet en boucle.
  useFocusEffect(
    useCallback(() => {
      fetchPressingOperations();
    }, [fetchPressingOperations]),
  );

  return (
    <ListScreen
      title="Production"
      description="Gérez les opérations de pression"
      data={PressingOperations.items}
      keyExtractor={(item) =>
        item.id.toString()
      }
      onCreate={() => router.push("/production/new")}
      renderItem={({ item }) => (
        <PressingOperationListItem
          operation={item}
          onPress={(production) =>
            router.push({
              pathname: "/production/[id]",
              params: {
                id: production.id.toString(),
              },
            })
          }
        />
      )}
      emptyTitle={
        loading
          ? "Chargement..."
          : error
            ? "Impossible de charger les productions"
            : "Aucune production"
      }
      emptyDescription={
        error ??
        "Aucune production ne correspond aux filtres actuels."
      }
      onApplyFilters={applyFilters}
      onResetFilters={resetFilters}
      activeFilterCount={countActiveFilters([
        filters.operationNumber,
        filters.fromDate,
        filters.toDate,
        filters.harvestNumber,
        filters.purchaseNumber,
      ])}
      filterContent={
        <>
          <FilterTextField
            label="Référence"
            placeholder="PRESS-2026-001"
            value={filters.operationNumber}
            onChangeText={(value) => setFilter("operationNumber", value)}
          />
          <FilterDateField
            label="Début à partir du"
            value={filters.fromDate}
            onChange={(value) => setFilter("fromDate", value)}
          />
          <FilterDateField
            label="Fin jusqu'au"
            value={filters.toDate}
            onChange={(value) => setFilter("toDate", value)}
          />
          <FilterTextField
            label="Réf. récolte"
            placeholder="HARV-2026-001"
            value={filters.harvestNumber}
            onChangeText={(value) => setFilter("harvestNumber", value)}
          />
          <FilterTextField
            label="Réf. achat"
            placeholder="Réf. de l'achat"
            value={filters.purchaseNumber}
            onChangeText={(value) => setFilter("purchaseNumber", value)}
          />
        </>
      }
    />
  );
};