import { StyleSheet, View } from "react-native";
import { radius, shadow, spacing } from "../../../../consts/spacing";
import { semanticColors } from "../../../../consts/Colors";
import { PressingGeneralInfoCard } from "../../widgets/PressingGeneralInfoCard";
import { HarvestSectionHeader } from "../../../harvest/components/details/HarvestSectionHeader";

type Props = {
  operation: Parameters<typeof PressingGeneralInfoCard>[0]["operation"];
};

export function PressingGeneralSection({ operation }: Props) {
  return (
    <View>
      <HarvestSectionHeader
        title="Informations générales"
        subtitle="Détails du pressurage"
      />

      <View style={styles.card}>
        <PressingGeneralInfoCard operation={operation} />
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