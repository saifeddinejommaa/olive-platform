import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export type HarvestMobileTab = "general" | "costs";

type Props = {
  activeTab: HarvestMobileTab;
  onChange: (tab: HarvestMobileTab) => void;
};

const TABS: { key: HarvestMobileTab; label: string }[] = [
  { key: "general", label: "Général" },
  { key: "costs", label: "Coûts" },
];

export function HarvestTabs({ activeTab, onChange }: Props) {
  return (
    <View style={styles.row}>
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onChange(tab.key)}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
    padding: 4,
  },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 6, alignItems: "center" },
  tabActive: { backgroundColor: "#fff" },
  label: { color: "#666", fontWeight: "500" },
  labelActive: { color: "#111" },
});
