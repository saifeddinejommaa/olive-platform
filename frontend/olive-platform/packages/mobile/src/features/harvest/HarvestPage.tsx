import { useHarvestsStore } from '@olive-platform/core/features/harvests/stores/HarvestsStore';
import { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { ListScreen } from '../../components/ListScreen';
import {
  countActiveFilters,
  FilterDateField,
  FilterTextField,
} from '../../components/filters/FilterFields';
import { ProductionStatusFilterField } from '../../components/filters/ProductionStatusFilterField';
import { HarvestListItem } from './widgets/HarvestListItem';
import { useFocusEffect, useRouter } from 'expo-router';

export const HarvestPage = () => {
  const router = useRouter();
  const {
    harvests,
    loading,
    error,
    filters,
    setFilter,
    clearFilters,
    fetchHarvests,
  } = useHarvestsStore();

  const applyFilters = () => {
    setFilter('pageNumber', 1);
    fetchHarvests();
  };

  const resetFilters = () => {
    clearFilters();
    fetchHarvests();
  };

  // Rechargé à chaque retour sur l'écran (ex. après la clôture d'une récolte).
  useFocusEffect(
    useCallback(() => {
      fetchHarvests();
    }, [fetchHarvests]),
  );

  return (
    <ListScreen
      title="Récolte"
      description="Gérez vos récoltes"
      data={harvests.items}
      keyExtractor={(item) => item.id.toString()}
      onCreate={() => router.push('/harvest/new')}
      renderItem={({ item }) => (
        <HarvestListItem
          harvest={item}
          onPress={(harvest) =>
            router.push({
              pathname: '/harvest/[id]',
              params: { id: harvest.id.toString() },
            })
          }
        />
      )}
      emptyTitle={
        loading
          ? 'Chargement...'
          : error
            ? 'Impossible de charger les récoltes'
            : 'Aucune récolte'
      }
      emptyDescription={
        error ??
        'Aucune récolte ne correspond aux filtres actuels.'
      }
      onApplyFilters={applyFilters}
      onResetFilters={resetFilters}
      activeFilterCount={countActiveFilters([
        filters.harvestNumber,
        filters.plotReference,
        filters.fromDate,
        filters.toDate,
        filters.status,
      ])}
      filterContent={
        <>
          <FilterTextField
            label="N° récolte"
            placeholder="HARV-2026-001"
            value={filters.harvestNumber}
            onChangeText={(value) => setFilter('harvestNumber', value)}
          />
          <FilterTextField
            label="Référence parcelle"
            placeholder="PLOT-001"
            value={filters.plotReference}
            onChangeText={(value) => setFilter('plotReference', value)}
          />
          <FilterDateField
            label="Début à partir du"
            value={filters.fromDate}
            onChange={(value) => setFilter('fromDate', value)}
          />
          <FilterDateField
            label="Fin jusqu'au"
            value={filters.toDate}
            onChange={(value) => setFilter('toDate', value)}
          />
          <ProductionStatusFilterField
            value={filters.status}
            onChange={(value) => setFilter('status', value)}
          />
        </>
      }
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },

  cardContent: {
    padding: 16,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#171717',
  },

  cardSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: '#777777',
  },
});
