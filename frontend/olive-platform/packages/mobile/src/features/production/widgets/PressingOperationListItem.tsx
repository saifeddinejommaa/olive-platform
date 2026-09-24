import { StyleSheet, Text, View } from 'react-native';
import { IconDroplet, IconFlask2, IconLeaf } from '@tabler/icons-react-native';

import { colors, semanticColors } from '../../../consts/Colors';
import { spacing } from '../../../consts/spacing';
import { typography } from '../../../consts/Typography';
import { PressingOperationForList } from '@olive-platform/core/features/production/domain/entities/PressingOperationForList';
import { ListItemCard } from '../../../components/ListItemCard';
import { ListItemHeader } from '../../../components/ListItemHeader';
import { formatDateOnly, formatNumberFR } from '../../../utils/formatter';
import { StepIndicatorRow } from '../../../components/StepIndicatorRow';
import { ProductionStatus } from '@olive-platform/core/features/production/domain/entities/ProductionStatus';


type ProductionListItemProps = {
  operation: PressingOperationForList;
  onPress?: (operation: PressingOperationForList) => void;
};

export function PressingOperationListItem({
  operation,
  onPress,
}: ProductionListItemProps) {
  return (
    <ListItemCard onPress={() => onPress?.(operation)}>
      <ListItemHeader
        title={operation.operationNumber}
        subtitle={formatDateOnly(operation.pressingDate, true) ?? undefined}
        status={operation.status}
      />

      {/* Quantités */}
      <View style={styles.quantities}>
        <View style={styles.quantityItem}>
          <View style={styles.quantityIcon}>
            <IconLeaf size={16} color={semanticColors.success} />
          </View>

          <View style={styles.quantityContent}>
            <Text style={styles.quantityLabel}>Olives</Text>
            <Text style={styles.quantityValue}>
              {formatNumberFR(operation.oliveQuantityKg)} kg
            </Text>
          </View>
        </View>

        <View style={styles.quantityDivider} />

        <View style={styles.quantityItem}>
          <View style={styles.quantityIcon}>
            <IconDroplet size={16} color={semanticColors.info} />
          </View>

          <View style={styles.quantityContent}>
            <Text style={styles.quantityLabel}>Huile produite</Text>
            <Text style={styles.quantityValue}>
              {formatNumberFR(operation.oilQuantityLiters)} L
            </Text>
          </View>
        </View>
      </View>

      <StepIndicatorRow
        steps={[
          {
            key: 'oliveAnalysis',
            visible: operation.oliveAnalysis == ProductionStatus.Completed,
            icon: IconFlask2,
            color: colors.teal[700],
          },
          {
            key: 'oilAnalysis',
            visible: operation.oilAnalysis == ProductionStatus.Completed,
            icon: IconFlask2,
            color: colors.gold[700],
          },
        ]}
      />
    </ListItemCard>
  );
}

const styles = StyleSheet.create({
  quantities: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,
    backgroundColor: semanticColors.background ?? '#F5F5F5',
  },
  quantityItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  quantityIcon: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticColors.surface ?? '#FFFFFF',
  },
  quantityContent: {
    flex: 1,
  },
  quantityLabel: {
    ...typography.caption,
    color: semanticColors.textMuted,
  },
  quantityValue: {
    ...typography.bodyStrong,
    color: semanticColors.textPrimary,
    marginTop: 2,
  },
  quantityDivider: {
    width: 1,
    height: 32,
    backgroundColor: semanticColors.border ?? '#E0E0E0',
  },
});