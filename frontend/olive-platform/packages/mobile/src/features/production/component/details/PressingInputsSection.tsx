import { StyleSheet, View } from "react-native";
import { radius, shadow, spacing } from "../../../../consts/spacing";
import { semanticColors } from "../../../../consts/Colors";
import { HarvestSectionHeader } from "../../../harvest/components/details/HarvestSectionHeader";
import { PressingInputsCard } from "./PressingInputsCard";
import { ProductionStatus } from "@olive-platform/core/features/production/domain/entities/ProductionStatus";
import { usePressingOperationInputsStore } from "@olive-platform/core/features/production/stores/PressingOperationInputsStore";

type Props = {
  operationId: number;
  status: ProductionStatus;
};

export function PressingInputsSection({ operationId, status }: Props) {

  const { fetchInputs, loading, inputs} = usePressingOperationInputsStore()
  return (
    <View>
      <HarvestSectionHeader
        title="Intrants"
        subtitle="Sources et quantités utilisées"
      />

      <View style={styles.card}>
        <PressingInputsCard operationId={operationId} status={status}  />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: semanticColors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: semanticColors.border,
    padding: spacing.lg,
    ...shadow.card,
  },
});