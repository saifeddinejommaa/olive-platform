import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { IconCheck, IconChevronDown } from "@tabler/icons-react-native";

import { GetHarvests } from "@olive-platform/core/features/harvests/domain/usecases/GetHarvests";
import { GetOlivePurchases } from "@olive-platform/core/features/olivePurchases/domain/usecases/GetOlivePurchases";
import { colors, semanticColors } from "../../../../consts/Colors";
import { typography } from "../../../../consts/Typography";
import { radius, shadow, spacing } from "../../../../consts/spacing";

export type PressingSourceType = "harvest" | "purchase";

export type PressingSource = {
  id: number;
  reference: string;
  subtitle: string;
};

type Props = {
  sourceType: PressingSourceType;
  value: PressingSource | null;
  // Sources déjà choisies dans d'autres blocs (non proposées à nouveau).
  excludedIds: number[];
  onChange: (source: PressingSource) => void;
};

const formatKg = (value: number | null | undefined) =>
  `${Number(value ?? 0).toLocaleString("fr-FR")} kg`;

// Récoltes / achats ayant encore des lots à presser.
async function searchSources(
  sourceType: PressingSourceType,
  search: string,
): Promise<PressingSource[]> {
  if (sourceType === "harvest") {
    const result = await GetHarvests({
      toPressing: true,
      harvestNumber: search || undefined,
      pageNumber: 1,
      pageSize: 20,
    });

    return result.items.map((harvest) => ({
      id: harvest.id,
      reference: harvest.reference,
      subtitle: `Récolte · ${formatKg(harvest.quantityKg)}`,
    }));
  }

  const result = await GetOlivePurchases({
    toPressing: true,
    purchaseNumber: search || undefined,
    pageNumber: 1,
    pageSize: 20,
  });

  return result.items.map((purchase) => ({
    id: purchase.id,
    reference: purchase.reference,
    subtitle: `${purchase.supplierName || "Achat"} · ${formatKg(purchase.quantityKg)}`,
  }));
}

export function PressingSourceSelector({
  sourceType,
  value,
  excludedIds,
  onChange,
}: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [sources, setSources] = useState<PressingSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const label = sourceType === "harvest" ? "Récolte" : "Achat";

  useEffect(() => {
    if (!modalVisible) return;

    let cancelled = false;

    const timeout = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await searchSources(sourceType, search.trim());
        if (!cancelled) setSources(data);
      } catch {
        if (!cancelled) {
          setSources([]);
          setError(`Impossible de charger les ${label.toLowerCase()}s.`);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [modalVisible, search, sourceType, label]);

  const visibleSources = sources.filter(
    (source) => source.id === value?.id || !excludedIds.includes(source.id),
  );

  const handleOpen = () => {
    setSearch("");
    setModalVisible(true);
  };

  const handleSelect = (source: PressingSource) => {
    onChange(source);
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
          {value
            ? value.reference
            : sourceType === "harvest"
              ? "Sélectionnez une récolte"
              : "Sélectionnez un achat"}
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

            <Text style={[typography.h2, styles.title]}>{label}</Text>

            <TextInput
              style={styles.search}
              placeholder={
                sourceType === "harvest"
                  ? "Rechercher une récolte..."
                  : "Rechercher un achat..."
              }
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={setSearch}
              autoCapitalize="characters"
            />

            {loading && (
              <ActivityIndicator
                style={styles.loader}
                color={semanticColors.primary}
              />
            )}

            {!loading && error && (
              <Text style={[typography.body, styles.message]}>{error}</Text>
            )}

            {!loading && !error && visibleSources.length === 0 && (
              <Text style={[typography.body, styles.message]}>
                {sourceType === "harvest"
                  ? "Aucune récolte à presser."
                  : "Aucun achat à presser."}
              </Text>
            )}

            {!loading && !error && visibleSources.length > 0 && (
              <ScrollView
                style={styles.list}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.options}>
                  {visibleSources.map((source) => {
                    const selected = source.id === value?.id;

                    return (
                      <Pressable
                        key={source.id}
                        onPress={() => handleSelect(source)}
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
                            {source.reference}
                          </Text>
                          <Text style={[typography.caption, styles.optionMeta]}>
                            {source.subtitle}
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
    marginBottom: spacing.md,
  },

  search: {
    ...typography.body,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    color: semanticColors.textPrimary,
    marginBottom: spacing.md,
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
    backgroundColor: colors.surface,
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
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.lg,
  },

  cancelPressed: {
    backgroundColor: colors.background,
  },

  cancelText: {
    color: semanticColors.textSecondary,
  },
});
