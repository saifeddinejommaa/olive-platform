import { useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { IconCheck, IconChevronDown } from "@tabler/icons-react-native";

import { SeasonStatus } from "@olive-platform/core/features/seasons/domain/entities/SeasonStatus";
import { useSeasonStore } from "../stores/SeasonStore";
import { colors, semanticColors } from "../consts/Colors";
import { typography } from "../consts/Typography";
import { radius, shadow, spacing } from "../consts/spacing";

export function SeasonSelector() {
  const seasons = useSeasonStore((state) => state.seasons);
  const selectedSeasonId = useSeasonStore((state) => state.selectedSeasonId);
  const selectSeason = useSeasonStore((state) => state.selectSeason);

  const [modalVisible, setModalVisible] = useState(false);

  const selectedSeason = useMemo(
    () => seasons.find((season) => season.id === selectedSeasonId),
    [seasons, selectedSeasonId],
  );

  const handleChange = (seasonId: number) => {
    selectSeason(seasonId);
    setModalVisible(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
      >
        <Text style={styles.chipText} numberOfLines={1}>
          {selectedSeason ? `Campagne ${selectedSeason.label}` : "Campagne"}
        </Text>

        <IconChevronDown size={16} color={colors.white} />
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

            <Text style={[typography.h2, styles.title]}>Campagne</Text>

            <Text style={[typography.body, styles.subtitle]}>
              Sélectionnez la campagne oléicole
            </Text>

            <View style={styles.options}>
              {seasons.map((season) => {
                const selected = season.id === selectedSeasonId;

                return (
                  <Pressable
                    key={season.id}
                    onPress={() => handleChange(season.id)}
                    style={({ pressed }) => [
                      styles.option,
                      selected && styles.optionSelected,
                      pressed && styles.optionPressed,
                    ]}
                  >
                    <Text
                      style={[
                        typography.body,
                        styles.optionLabel,
                        selected && styles.optionLabelSelected,
                      ]}
                    >
                      {season.status === SeasonStatus.Closed
                        ? `${season.label} (clôturée)`
                        : season.label}
                    </Text>

                    {selected && (
                      <IconCheck size={20} color={semanticColors.primary} />
                    )}
                  </Pressable>
                );
              })}
            </View>

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
  chip: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255, 255, 255, 0.16)",
  },

  chipPressed: {
    backgroundColor: "rgba(255, 255, 255, 0.28)",
  },

  chipText: {
    ...typography.caption,
    color: colors.white,
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
  },

  subtitle: {
    color: semanticColors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },

  options: {
    gap: spacing.sm,
  },

  option: {
    minHeight: 52,
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

  optionLabel: {
    color: semanticColors.textPrimary,
  },

  optionLabelSelected: {
    color: colors.olive[800],
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
