import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { IconCheck, IconChevronDown } from "@tabler/icons-react-native";

import type { PlotForList } from "@olive-platform/core/features/plots/domain/entities/PlotForList";
import { GetPlots } from "@olive-platform/core/features/plots/domain/usecases/GetPlots";
import { colors, semanticColors } from "../../../../consts/Colors";
import { typography } from "../../../../consts/Typography";
import { radius, shadow, spacing } from "../../../../consts/spacing";

type Props = {
  value: PlotForList | null;
  onChange: (plot: PlotForList) => void;
};

export function PlotSelector({ value, onChange }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [plots, setPlots] = useState<PlotForList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Chargées à l'ouverture : la liste reste à jour sans effet dédié.
  const handleOpen = async () => {
    setModalVisible(true);
    setLoading(true);
    setError(null);

    try {
      const result = await GetPlots({ pageNumber: 1, pageSize: 100 });
      setPlots(result.items);
    } catch {
      setError("Impossible de charger les parcelles.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (plot: PlotForList) => {
    onChange(plot);
    setModalVisible(false);
  };

  return (
    <>
      <Pressable
        onPress={handleOpen}
        style={({ pressed }) => [styles.selector, pressed && styles.pressed]}
      >
        <Text
          numberOfLines={1}
          style={[
            typography.body,
            styles.selectorText,
            !value && styles.placeholder,
          ]}
        >
          {value ? value.name : "Sélectionnez une parcelle"}
        </Text>

        <IconChevronDown size={18} color={semanticColors.textSecondary} />
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Pressable
            style={styles.backdrop}
            onPress={() => setModalVisible(false)}
          />

          <View style={styles.bottomSheet}>
            <View style={styles.handle} />

            <Text style={[typography.h2, styles.title]}>Parcelle</Text>

            {loading && (
              <ActivityIndicator
                style={styles.loader}
                color={semanticColors.primary}
              />
            )}

            {!loading && error && (
              <Text style={[typography.body, styles.message]}>{error}</Text>
            )}

            {!loading && !error && plots.length === 0 && (
              <Text style={[typography.body, styles.message]}>
                Aucune parcelle enregistrée.
              </Text>
            )}

            {!loading && !error && plots.length > 0 && (
              <ScrollView style={styles.list}>
                <View style={styles.options}>
                  {plots.map((plot) => {
                    const selected = plot.id === value?.id;

                    return (
                      <Pressable
                        key={plot.id}
                        onPress={() => handleSelect(plot)}
                        style={({ pressed }) => [
                          styles.option,
                          selected && styles.optionSelected,
                          pressed && styles.optionPressed,
                        ]}
                      >
                        <View style={styles.optionText}>
                          <Text
                            style={[
                              typography.bodyStrong,
                              styles.optionLabel,
                              selected && styles.optionLabelSelected,
                            ]}
                          >
                            {plot.name}
                          </Text>
                          <Text style={[typography.caption, styles.optionMeta]}>
                            {plot.reference} · {plot.numberOfTrees} arbres
                          </Text>
                        </View>

                        {selected && (
                          <IconCheck size={20} color={semanticColors.primary} />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>
            )}

            <Pressable
              onPress={() => setModalVisible(false)}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.cancelPressed,
              ]}
            >
              <Text style={[typography.bodyStrong, styles.cancelText]}>
                Annuler
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },

  selectorText: {
    flex: 1,
    color: semanticColors.textPrimary,
  },

  placeholder: {
    color: semanticColors.textMuted,
  },

  pressed: {
    backgroundColor: colors.background,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },

  bottomSheet: {
    maxHeight: "80%",
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
    ...shadow.raised,
  },

  handle: {
    width: 40,
    height: 4,
    alignSelf: "center",
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    marginBottom: spacing.xl,
  },

  title: {
    color: semanticColors.textPrimary,
    marginBottom: spacing.lg,
  },

  loader: {
    paddingVertical: spacing.xl,
  },

  message: {
    color: semanticColors.textSecondary,
    paddingVertical: spacing.lg,
  },

  list: {
    flexGrow: 0,
  },

  options: {
    gap: spacing.sm,
  },

  option: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },

  optionSelected: {
    borderColor: colors.olive[500],
    backgroundColor: colors.olive[100],
  },

  optionPressed: {
    backgroundColor: colors.background,
  },

  optionText: {
    flex: 1,
    paddingVertical: spacing.sm,
  },

  optionLabel: {
    color: semanticColors.textPrimary,
  },

  optionLabelSelected: {
    color: colors.olive[800],
  },

  optionMeta: {
    color: semanticColors.textSecondary,
    marginTop: 2,
  },

  cancelButton: {
    marginTop: spacing.xl,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.background,
  },

  cancelPressed: {
    opacity: 0.7,
  },

  cancelText: {
    color: semanticColors.textSecondary,
  },
});
