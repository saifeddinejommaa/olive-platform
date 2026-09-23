import { StyleSheet, View } from "react-native";
import { radius, shadow, spacing } from "../../../../consts/spacing";
import { colors, semanticColors } from "../../../../consts/Colors";
import { HarvestSectionHeader } from "./HarvestSectionHeader";
import { HarvestGeneralInfoCard } from "../../widgets/HarvestGeneralInfoCard";

type Props = {
  harvest: any;
  editable: boolean;
};

export function HarvestGeneralSection({ harvest, editable }: Props) {
  return (
    <View>
      <HarvestSectionHeader
        title="Informations générales"
        subtitle="Détails de la récolte"
      />

      <View style={styles.card}>
        <HarvestGeneralInfoCard harvest={harvest} editable={editable} />
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