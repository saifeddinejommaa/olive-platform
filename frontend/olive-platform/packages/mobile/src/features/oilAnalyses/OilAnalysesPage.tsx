import { useCallback, type ReactNode } from "react";
import { useFocusEffect, useRouter } from "expo-router";

import { useOilAnalysesListStore } from "@olive-platform/core/features/analyses/oilAnalyses/stores/UseAnalysesListStore";
import { ListScreen } from "../../components/ListScreen";
import {
  countActiveFilters,
  FilterDateField,
  FilterTextField,
} from "../../components/filters/FilterFields";
import { ProductionStatusFilterField } from "../../components/filters/ProductionStatusFilterField";

import { OilAnalysisListItem } from "./widgets/OilAnalysisListItem";

type Props = {
  // Contenu en tête de liste (bascule Olive / Huile).
  headerContent?: ReactNode;
};

// Analyses d'huile : créées automatiquement à la clôture de chaque pression.
export const OilAnalysesPage = ({ headerContent }: Props) => {
  const router = useRouter();

  const { items, loading, error, filters, setFilters, fetchList, clear } =
    useOilAnalysesListStore();

  const resetFilters = () => {
    clear();
    fetchList();
  };

  // Rechargé à chaque retour sur l'écran (ex. après une analyse clôturée).
  useFocusEffect(
    useCallback(() => {
      fetchList();
    }, [fetchList]),
  );

  return (
    <ListScreen
      title="Analyses"
      description="Suivez les analyses d'huile"
      headerContent={headerContent}
      canCreate={false}
      data={items}
      keyExtractor={(item) => item.id.toString()}
      onCreate={() => undefined}
      renderItem={({ item }) => (
        <OilAnalysisListItem
          analysis={item}
          onPress={(analysis) =>
            router.push({
              pathname: "/oil-analyses/[id]",
              params: { id: analysis.id.toString() },
            })
          }
        />
      )}
      emptyTitle={
        loading
          ? "Chargement..."
          : error
            ? "Impossible de charger les analyses"
            : "Aucune analyse d'huile"
      }
      emptyDescription={
        error ?? "Les analyses d'huile sont créées à la clôture des pressions."
      }
      onApplyFilters={() => fetchList()}
      onResetFilters={resetFilters}
      activeFilterCount={countActiveFilters([
        filters.reference,
        filters.pressingReference,
        filters.fromDate,
        filters.toDate,
        filters.status,
      ])}
      filterContent={
        <>
          <FilterTextField
            label="Référence"
            placeholder="OIL_ANALYSIS-2026-001"
            value={filters.reference}
            onChangeText={(value) => setFilters({ reference: value })}
          />
          <FilterTextField
            label="Réf. pression"
            placeholder="PRES-2026-001"
            value={filters.pressingReference}
            onChangeText={(value) => setFilters({ pressingReference: value })}
          />
          <FilterDateField
            label="Début à partir du"
            value={filters.fromDate}
            onChange={(value) => setFilters({ fromDate: value })}
          />
          <FilterDateField
            label="Fin jusqu'au"
            value={filters.toDate}
            onChange={(value) => setFilters({ toDate: value })}
          />
          <ProductionStatusFilterField
            value={filters.status}
            onChange={(value) => setFilters({ status: value })}
          />
        </>
      }
    />
  );
};
