import { useHarvestsStore } from '@olive-platform/core/features/harvests/stores/HarvestsStore';
import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ListScreen } from '../../components/ListScreen';
import { HarvestListItem } from './widgets/HarvestListItem';
import { useFocusEffect, useRouter } from 'expo-router';

export const HarvestPage = () => {
  const router = useRouter();
  const {
    harvests,
    loading,
    error,
    fetchHarvests,
  } = useHarvestsStore();

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
