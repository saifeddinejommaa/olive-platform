import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  IconCash,
  IconInfoCircle,
} from "@tabler/icons-react-native";
import { typography } from "../../../../consts/Typography";
import { colors, semanticColors } from "../../../../consts/Colors";
import { spacing } from "../../../../consts/spacing";

export type HarvestMobileTab = "general" | "costs";

type Props = {
  activeTab: HarvestMobileTab;
  onChange: (tab: HarvestMobileTab) => void;
};

const tabs = [
  {
    key: "general" as const,
    label: "Générale",
    Icon: IconInfoCircle,
  },
  {
    key: "costs" as const,
    label: "Coûts",
    Icon: IconCash,
  },
];

export function HarvestTabs({ activeTab, onChange }: Props) {
  return (
    <View style={styles.container}>
      {tabs.map(({ key, label, Icon }) => {
        const active = activeTab === key;

        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            style={({ pressed }) => [
              styles.tab,
              pressed && styles.pressed,
            ]}
          >
            <Icon
              size={20}
              color={
                active
                  ? semanticColors.primary
                  : semanticColors.textMuted
              }
            />

            <Text
              style={[
                typography.caption,
                styles.label,
                active && styles.activeLabel,
              ]}
            >
              {label}
            </Text>

            {active && <View style={styles.indicator} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  tab: {
    flex: 1,
    minHeight: 68,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    position: "relative",
  },

  pressed: {
    opacity: 0.6,
  },

  label: {
    color: semanticColors.textMuted,
  },

  activeLabel: {
    color: semanticColors.primary,
    fontWeight: "700",
  },

  indicator: {
    position: "absolute",
    left: spacing.xxl,
    right: spacing.xxl,
    bottom: -1,
    height: 3,
    borderRadius: 3,
    backgroundColor: semanticColors.primary,
  },
});