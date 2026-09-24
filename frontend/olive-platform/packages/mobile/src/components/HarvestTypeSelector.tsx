import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  IconCheck,
  IconChevronDown,
} from "@tabler/icons-react-native";

import { useConstantsStore } from "../stores/ConstantsStore";
import { colors, semanticColors } from "../consts/Colors";
import { typography } from "../consts/Typography";
import { radius, shadow, spacing } from "../consts/spacing";

type HarvestTypeSelectorProps = {
  value?: number | null;
  disabled?: boolean;
  onChange: (harvestTypeId: number | null) => void;
};

export default function HarvestTypeSelector({
  value,
  disabled = false,
  onChange,
}: HarvestTypeSelectorProps) {
  const {
    Appconstants,
    loading,
    fetchConstants,
  } = useConstantsStore();

  const [modalVisible, setModalVisible] = useState(false);

  const harvests = Appconstants.harvestTypes;
  useEffect(() => {
    fetchConstants();
  }, [fetchConstants]);

  const selectedHarvest = useMemo(() => {
    return harvests.find(
      (harvest) => harvest.id === value,
    );
  }, [harvests, value]);

  const handleOpen = () => {
    if (disabled || loading) {
      return;
    }

    setModalVisible(true);
  };

  const handleChange = (id: number) => {
    onChange(id);
    setModalVisible(false);
  };

  return (
    <>
      {/* SELECTOR */}
      <Pressable
        onPress={handleOpen}
        disabled={disabled || loading}
        style={({ pressed }) => [
          styles.selector,
          disabled && styles.disabled,
          pressed && !disabled && styles.pressed,
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            typography.body,
            styles.selectorText,
            !selectedHarvest && styles.placeholder,
          ]}
        >
          {loading
            ? "Chargement..."
            : selectedHarvest?.label ??
              "Sélectionnez un type de récolte"}
        </Text>

        <IconChevronDown
          size={18}
          color={
            disabled
              ? semanticColors.textMuted
              : semanticColors.textSecondary
          }
        />
      </Pressable>

      {/* BOTTOM MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/* BACKDROP */}
          <Pressable
            style={styles.backdrop}
            onPress={() => setModalVisible(false)}
          />

          {/* BOTTOM SHEET */}
          <View style={styles.bottomSheet}>
            <View style={styles.handle} />

            <Text style={[typography.h2, styles.title]}>
              Type de récolte
            </Text>

            <Text style={[typography.body, styles.subtitle]}>
              Sélectionnez un type de récolte
            </Text>

            <View style={styles.options}>
              {harvests.map((harvest) => {
                const selected = harvest.id === value;

                return (
                  <Pressable
                    key={harvest.id}
                    onPress={() => handleChange(harvest.id)}
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
                        selected &&
                          styles.optionLabelSelected,
                      ]}
                    >
                      {harvest.label}
                    </Text>

                    {selected && (
                      <IconCheck
                        size={20}
                        color={semanticColors.primary}
                      />
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
              <Text
                style={[
                  typography.bodyStrong,
                  styles.cancelText,
                ]}
              >
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
    minHeight: 44,
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

  disabled: {
    opacity: 0.5,
  },

  pressed: {
    backgroundColor: colors.background,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },

  backdrop: {
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
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },

  optionSelected: {
    borderColor: semanticColors.primary,
    backgroundColor: semanticColors.primarySoft,
  },

  optionPressed: {
    opacity: 0.7,
  },

  optionLabel: {
    color: semanticColors.textPrimary,
  },

  optionLabelSelected: {
    color: semanticColors.primary,
    fontWeight: "600",
  },

  cancelButton: {
    alignItems: "center",
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
  },

  cancelPressed: {
    opacity: 0.6,
  },

  cancelText: {
    color: semanticColors.textSecondary,
  },
});