import { useHarvestsStore } from '@olive-platform/core/features/harvests/stores/HarvestsStore';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ListScreen } from '../../../components/ListScreen';
import { HarvestListItem } from '../widgets/HarvestListItem';

export const HarvestPage = () => {
  const {
    harvests,
    loading,
    error,
    fetchHarvests,
  } = useHarvestsStore();

  useEffect(() => {
    fetchHarvests();
  }, [fetchHarvests]);

  return (
    <ListScreen
      title="Récolte"
      description="Gérez vos récoltes"
      data={harvests.items}
      keyExtractor={(item) => item.id.toString()}
      onCreate={() => {
        console.log('Créer une récolte');
      }}
      renderItem={({ item }) => (
        <HarvestListItem harvest={item} />
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
      filterContent={
        <View>
          <Text>Filtres des récoltes</Text>
        </View>
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
