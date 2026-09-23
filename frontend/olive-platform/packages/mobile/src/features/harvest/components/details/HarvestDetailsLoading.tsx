import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { spacing } from "../../../../consts/spacing";
import {semanticColors } from "../../../../consts/Colors";
import { Screen } from "../../../../components/Screen";
import { typography } from "../../../../consts/Typography";

export function HarvestDetailsLoading() {
  return (
    <Screen>
      <View style={styles.container}>
        <ActivityIndicator size="large" color={semanticColors.primary} />
        <Text style={styles.text}>Chargement de la récolte...</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xxl,
  },
  text: {
    ...typography.body,
    color: semanticColors.textSecondary,
    marginTop: spacing.md,
  },
});