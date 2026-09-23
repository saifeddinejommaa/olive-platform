import { Pressable, StyleSheet, Text, View } from "react-native";
import { radius, spacing } from "../../../../consts/spacing";
import {colors, semanticColors } from "../../../../consts/Colors";
import { typography } from "../../../../consts/Typography";

export type HarvestMobileTab = "general" | "costs";

type Props = {
  activeTab: HarvestMobileTab;
  onChange: (tab: HarvestMobileTab) => void;
};

const tabs: { key: HarvestMobileTab; label: string }[] = [
  { key: "general", label: "Général" },
  { key: "costs", label: "Coûts" },
];

export function HarvestTabs({ activeTab, onChange }: Props) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const active = activeTab === tab.key;

        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={({ pressed }) => [
              styles.tab,
              active && styles.activeTab,
              pressed && !active && styles.pressedTab,
            ]}
          >
            <Text style={[typography.bodyStrong, styles.label, active && styles.activeLabel]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xs,
  },

  tab: {
    flex: 1,
    minHeight: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },

  activeTab: {
    backgroundColor: semanticColors.primarySoft,
  },

  pressedTab: {
    backgroundColor: colors.background,
  },

  label: {
    color: semanticColors.textSecondary,
  },

  activeLabel: {
    color: semanticColors.primary,
  },
});