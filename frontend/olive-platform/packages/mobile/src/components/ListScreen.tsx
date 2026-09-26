import { ReactElement, ReactNode, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  IconAdjustmentsHorizontal,
  IconPlus,
} from '@tabler/icons-react-native';

import { FilterModal } from './FilterModal';
import { colors } from '../consts/Colors';
import { typography } from '../consts/Typography';
import { radius, shadow, spacing } from '../consts/spacing';

type ListScreenProps<T> = {
  title: string;
  description?: string;

  data: T[];

  renderItem: ({ item }: { item: T }) => ReactElement | null;
  keyExtractor: (item: T, index: number) => string;

  onCreate: () => void;
  createLabel?: string;
  canCreate?: boolean
  filterContent?: ReactNode;
  onApplyFilters?: () => void;
  onResetFilters?: () => void;
  activeFilterCount?: number;

  emptyTitle?: string;
  emptyDescription?: string;
};

export function ListScreen<T>({
  title,
  description,
  data,
  renderItem,
  keyExtractor,
  onCreate,
  createLabel = 'Nouveau',
  canCreate = true,
  filterContent,
  onApplyFilters,
  onResetFilters,
  activeFilterCount = 0,
  emptyTitle = 'Aucun élément',
  emptyDescription = 'Aucun élément ne correspond à votre recherche.',
}: ListScreenProps<T>) {
  const [filterVisible, setFilterVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Bandeau coloré */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>{title}</Text>

        {description && (
          <Text style={styles.bannerDescription}>{description}</Text>
        )}
      </View>

      {/* Carte flottante — chevauche le bas du bandeau */}
      <View style={styles.actionsCard}>
        <View style={styles.actionsCardTop}>
          <Text style={styles.resultsCount}>
            {data.length} {data.length > 1 ? 'résultats' : 'résultat'}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterVisible(true)}
            activeOpacity={0.75}
          >
            <IconAdjustmentsHorizontal
              size={18}
              color={colors.olive[700]}
            />
            <Text style={styles.filterButtonText}>Filtrer</Text>

            {activeFilterCount > 0 && (
              <View style={styles.filterCountDot}>
                <Text style={styles.filterCountDotText}>
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {canCreate &&
          <TouchableOpacity
            style={styles.createButton}
            onPress={onCreate}
            activeOpacity={0.85}
          >
            <IconPlus size={18} color={colors.white} />
            <Text style={styles.createButtonText}>{createLabel}</Text>
          </TouchableOpacity>
          }
        </View>
      </View>

      {/* Liste */}
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => renderItem({ item })}
        contentContainerStyle={
          data.length === 0 ? styles.emptyList : styles.list
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIconCircle}>
              <IconAdjustmentsHorizontal
                size={26}
                color={colors.olive[600]}
              />
            </View>

            <Text style={styles.emptyTitle}>{emptyTitle}</Text>

            <Text style={styles.emptyDescription}>
              {emptyDescription}
            </Text>
          </View>
        }
      />

      {/* Modal des filtres */}
      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={() => {
          onApplyFilters?.();
          setFilterVisible(false);
        }}
        onReset={onResetFilters}
      >
        {filterContent}
      </FilterModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  banner: {
    backgroundColor: colors.olive[800],
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    // paddingBottom généreux : la carte flottante vient chevaucher
    // cette zone grâce à sa marge négative (voir actionsCard).
    paddingBottom: spacing.xxxl + spacing.xl,
  },

  bannerTitle: {
    ...typography.display,
    color: colors.white,
  },

  bannerDescription: {
    ...typography.body,
    marginTop: spacing.xs,
    color: colors.olive[100],
  },

  actionsCard: {
    marginTop: -spacing.xxxl,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    ...shadow.raised,
  },

  actionsCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },

  resultsCount: {
    ...typography.caption,
    color: colors.textSecondary,
  },

  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  filterButton: {
    flex: 1,
    height: 46,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.olive[600],
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },

  filterButtonText: {
    ...typography.bodyStrong,
    color: colors.olive[700],
  },

  filterCountDot: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.gold[600],
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterCountDotText: {
    ...typography.label,
    fontSize: 11,
    color: colors.ink,
  },

  createButton: {
    flex: 1,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.olive[700],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    ...shadow.card,
  },

  createButtonText: {
    ...typography.bodyStrong,
    color: colors.white,
  },

  list: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },

  emptyList: {
    flexGrow: 1,
    padding: spacing.xxl,
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },

  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.olive[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },

  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },

  emptyDescription: {
    ...typography.body,
    marginTop: spacing.xs,
    color: colors.textMuted,
    textAlign: 'center',
    maxWidth: 280,
  },
});
