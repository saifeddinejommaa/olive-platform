import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  IconCalendarEvent,
  IconChevronRight,
  IconClock,
  IconDroplet,
  IconFlask2,
  IconMapPin,
  IconTree,
} from '@tabler/icons-react-native';

import { HarvestForList } from '@olive-platform/core/features/harvests/domain/entities/HarvestForList';
import { colors } from '../../../consts/Colors';
import { radius, shadow, spacing } from '../../../consts/spacing';
import { typography } from '../../../consts/Typography';
import { ProductionStatusBadge } from '../../../app/components/ProductionStatusBadge';

type HarvestListItemProps = {
  harvest: HarvestForList;
  onPress?: (harvest: HarvestForList) => void;
};



function formatTime(time: string | null): string | null {
  if (!time) return null;

  // TimeOnly arrive depuis l'API sous la forme "08:30:00"
  // On affiche uniquement "08:30"
  return time.slice(0, 5);
}

function formatDate(date: string | null): string | null {
  if (!date) return null;

  // DateOnly arrive sous la forme "2026-09-21"
  const parts = date.split('-');

  if (parts.length !== 3) return null;

  const [year, month, day] = parts;

  return `${day}/${month}`;
}

export function HarvestListItem({
  harvest,
  onPress,
}: HarvestListItemProps) {

  const startTime = formatTime(harvest.startTime);
  const endTime = formatTime(harvest.endTime);

  let period = 'Horaire non défini';

  if (startTime && endTime) {
    period = `${startTime} → ${endTime}`;
  } else if (startTime) {
    period = `Depuis ${startTime}`;
  } else if (endTime) {
    period = `Jusqu'à ${endTime}`;
  }

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => onPress?.(harvest)}
    >
      {/* En-tête */}
      <View style={styles.header}>
        <View style={styles.headerMain}>
          <Text style={styles.reference} numberOfLines={1}>
            {harvest.reference}
          </Text>

          <Text style={styles.date}>
            {formatDate(harvest.harvestDate)}
          </Text>
        </View>

        <ProductionStatusBadge status={harvest.status}/>
      </View>

      {/* Parcelle + variété */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <IconMapPin size={14} color={colors.textMuted} />
          <Text style={styles.metaText}>
            Parcelle #{harvest.plotId}
          </Text>
        </View>

        <View style={styles.metaDot} />

        <View style={styles.metaItem}>
          <IconTree size={14} color={colors.textMuted} />
          <Text style={styles.metaText}>
            {harvest.variety}
          </Text>
        </View>
      </View>

      {/* Horaire */}
      <View style={styles.timeBlock}>
        <IconClock size={18} color={colors.olive[700]} />

        <View>
          <Text style={styles.timeLabel}>
            Horaire de récolte
          </Text>

          <Text style={styles.timeValue}>
            {period}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerRight}>
          {harvest.pressed && (
            <View style={styles.stepIcon}>
              <IconDroplet
                size={14}
                color={colors.teal[700]}
              />
            </View>
          )}

          {harvest.analysis && (
            <View style={styles.stepIcon}>
              <IconFlask2
                size={14}
                color={colors.gold[700]}
              />
            </View>
          )}

          <IconChevronRight
            size={18}
            color={colors.textMuted}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.card,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },

  headerMain: {
    flex: 1,
  },

  reference: {
    ...typography.h3,
    color: colors.textPrimary,
  },

  date: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  metaText: {
    ...typography.caption,
    color: colors.textSecondary,
  },

  metaDot: {
    width: 3,
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.textMuted,
  },

  timeBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.background,
  },

  timeLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },

  timeValue: {
    ...typography.label,
    color: colors.textPrimary,
    marginTop: 2,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },

  stepIcon: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

