import { StyleSheet, Text, View } from 'react-native';
import { ProductionStatusBadge } from './ProductionStatusBadge';
import { spacing } from '../consts/spacing';
import { typography } from '../consts/Typography';
import { semanticColors } from '../consts/Colors';

type ListItemHeaderProps = {
  title: string;
  subtitle?: string | null;
  // Ajuste le type ici selon l'enum/type réel utilisé par ProductionStatusBadge
  status?: React.ComponentProps<typeof ProductionStatusBadge>['status'];
};

export function ListItemHeader({
  title,
  subtitle,
  status,
}: ListItemHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerMain}>
        <Text style={styles.reference} numberOfLines={1}>
          {title}
        </Text>

        {subtitle && <Text style={styles.date}>{subtitle}</Text>}
      </View>

      {status !== undefined && <ProductionStatusBadge status={status} />}
    </View>
  );
}

const styles = StyleSheet.create({
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
    color: semanticColors.textPrimary,
  },
  date: {
    ...typography.caption,
    color: semanticColors.textMuted,
    marginTop: 2,
  },
});