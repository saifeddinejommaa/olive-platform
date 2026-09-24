import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Screen } from "./Screen";
import { semanticColors } from "../consts/Colors";
import { spacing } from "../consts/spacing";
import { typography } from "../consts/Typography";


export function Loading() {
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