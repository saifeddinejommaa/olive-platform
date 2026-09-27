import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { IconTrash } from "@tabler/icons-react-native";

import type { HarvestCostSummary } from "@olive-platform/core/features/harvests/domain/entities/HarvestCostSummary";
import type { HarvestStockParams } from "@olive-platform/core/features/harvests/domain/params/HarvestStockParams";
import { useConstantsStore } from "../../../../stores/ConstantsStore";
import { colors, semanticColors } from "../../../../consts/Colors";
import { typography } from "../../../../consts/Typography";
import { radius, shadow, spacing } from "../../../../consts/spacing";

type Props = {
  visible: boolean;
  saving?: boolean;
  harvest: {
    quantityKg: number | null;
    harvestedTrees: number | null;
    plannedTrees: number;
    costs: HarvestCostSummary[];
  };
  onClose: () => void;
  onConfirm: (params: CloseHarvestSheetResult) => Promise<void> | void;
};

export type CloseHarvestSheetResult = {
  quantityKg: number;
  harvestedTrees: number;
  // Répartition de la quantité dans les stocks (somme = quantityKg).
  stocks: HarvestStockParams[];
  proceedAnalyse: boolean;
};

const formatNumber = (value: number, digits = 3) =>
  value.toLocaleString("fr-FR", { maximumFractionDigits: digits });

const parseNumber = (value: string) => Number(value.replace(",", ".").trim());

// Comparaison au gramme près (évite les erreurs d'arrondi des décimaux).
const toGrams = (kg: number) => Math.round(kg * 1000);

/**
 * Récapitulatif avant clôture : quantité et arbres récoltés (pré-remplis,
 * ajustables) et coûts de la récolte.
 */
export function CloseHarvestSheet({
  visible,
  saving,
  harvest,
  onClose,
  onConfirm,
}: Props) {
  const { Appconstants } = useConstantsStore();

  const [quantityKg, setQuantityKg] = useState(
    harvest.quantityKg ? String(harvest.quantityKg) : "",
  );
  const [harvestedTrees, setHarvestedTrees] = useState(
    String(harvest.harvestedTrees ?? harvest.plannedTrees ?? 0),
  );
  // Par défaut, un seul stock contenant toute la quantité.
  const [stocks, setStocks] = useState<string[]>(() => [
    harvest.quantityKg ? String(harvest.quantityKg) : "",
  ]);
  const [proceedAnalyse, setProceedAnalyse] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quantity = parseNumber(quantityKg);
  const trees = Number(harvestedTrees.trim() || "0");

  const stockValues = stocks.map((stock) => parseNumber(stock || "0"));
  const totalKg = Number.isNaN(quantity) ? 0 : quantity;
  const distributedKg = stockValues.reduce(
    (sum, value) => sum + (Number.isNaN(value) ? 0 : value),
    0,
  );
  const remainingKg = (toGrams(totalKg) - toGrams(distributedKg)) / 1000;

  const handleQuantityChange = (value: string) => {
    setQuantityKg(value);
    setError(null);

    // Tant qu'il n'y a qu'un stock, il suit la quantité totale.
    setStocks((current) => (current.length === 1 ? [value] : current));
  };

  const handleStockChange = (index: number, value: string) => {
    setStocks((current) =>
      current.map((stock, stockIndex) => (stockIndex === index ? value : stock)),
    );
    setError(null);
  };

  const handleAddStock = () => {
    // Le nouveau stock reçoit la quantité restante, s'il en reste.
    setStocks((current) => [
      ...current,
      remainingKg > 0 ? String(remainingKg) : "",
    ]);
    setError(null);
  };

  const handleRemoveStock = (index: number) => {
    setStocks((current) =>
      current.filter((_, stockIndex) => stockIndex !== index),
    );
    setError(null);
  };

  const costs = harvest.costs ?? [];
  const totalCost = costs.reduce((sum, cost) => sum + cost.totalAmount, 0);
  const costPerKg =
    quantity > 0 && totalCost > 0 ? totalCost / quantity : null;

  const typeLabel = (typeId: number) =>
    Appconstants.costLineTypes.find((type) => type.id === typeId)?.label ??
    "Autre";

  const handleConfirm = async () => {
    Keyboard.dismiss();

    if (!quantityKg.trim() || Number.isNaN(quantity) || quantity <= 0) {
      setError("La quantité récoltée doit être supérieure à 0.");
      return;
    }

    if (!Number.isInteger(trees) || trees < 0) {
      setError("Le nombre d'arbres récoltés doit être un entier positif.");
      return;
    }

    if (stockValues.some((value) => Number.isNaN(value) || value <= 0)) {
      setError("Chaque stock doit avoir une quantité supérieure à 0.");
      return;
    }

    if (toGrams(distributedKg) !== toGrams(quantity)) {
      setError(
        remainingKg > 0
          ? `Il reste ${formatNumber(remainingKg)} kg à répartir dans les stocks.`
          : `Les stocks dépassent la quantité récoltée de ${formatNumber(-remainingKg)} kg.`,
      );
      return;
    }

    setError(null);

    try {
      await onConfirm({
        quantityKg: quantity,
        harvestedTrees: trees,
        stocks: stockValues.map((value) => ({ quantityKg: value })),
        proceedAnalyse,
      });
    } catch (e: any) {
      setError(e?.message ?? "Impossible de clôturer la récolte.");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          <Text style={[typography.h2, styles.title]}>
            Clôturer la récolte
          </Text>
          <Text style={[typography.body, styles.subtitle]}>
            Vérifiez le récapitulatif avant de clôturer.
          </Text>

          <ScrollView
            style={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* RÉCOLTE */}
            <Text style={styles.sectionTitle}>Récolte</Text>
            <View style={styles.block}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Quantité récoltée (kg)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                  value={quantityKg}
                  onChangeText={handleQuantityChange}
                />
              </View>

              <View style={styles.separator} />

              <View style={styles.row}>
                <Text style={styles.rowLabel}>
                  Arbres récoltés (prévus : {harvest.plannedTrees})
                </Text>
                <TextInput
                  style={styles.input}
                  keyboardType="number-pad"
                  value={harvestedTrees}
                  onChangeText={(value) => {
                    setHarvestedTrees(value);
                    setError(null);
                  }}
                />
              </View>
            </View>

            {/* STOCKS */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, styles.sectionTitleInline]}>
                Répartition dans les stocks
              </Text>

              <TouchableOpacity
                onPress={handleAddStock}
                disabled={saving}
                hitSlop={8}
              >
                <Text style={styles.addStock}>+ Ajouter un stock</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.block}>
              {stocks.map((stock, index) => (
                <View key={index} style={styles.row}>
                  <Text style={styles.rowLabel}>Stock {index + 1} (kg)</Text>

                  <View style={styles.stockInputRow}>
                    <TextInput
                      style={styles.input}
                      keyboardType="decimal-pad"
                      placeholder="0"
                      placeholderTextColor={colors.textMuted}
                      value={stock}
                      onChangeText={(value) => handleStockChange(index, value)}
                    />

                    {stocks.length > 1 && (
                      <TouchableOpacity
                        onPress={() => handleRemoveStock(index)}
                        hitSlop={8}
                        accessibilityLabel={`Supprimer le stock ${index + 1}`}
                      >
                        <IconTrash size={20} color={semanticColors.danger} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}

              <View style={styles.separator} />

              <View style={styles.costRow}>
                <Text style={styles.rowLabel}>Réparti</Text>
                <Text style={styles.rowValue}>
                  {formatNumber(distributedKg)} / {formatNumber(totalKg)} kg
                </Text>
              </View>

              <View style={styles.costRow}>
                <Text style={styles.rowLabel}>Restant</Text>
                <Text
                  style={[
                    styles.rowValue,
                    styles.strong,
                    remainingKg === 0 ? styles.ok : styles.warning,
                  ]}
                >
                  {formatNumber(remainingKg)} kg
                </Text>
              </View>
            </View>

            {/* ANALYSE */}
            <View style={[styles.block, styles.switchBlock]}>
              <View style={styles.switchText}>
                <Text style={[typography.bodyStrong, styles.rowLabel]}>
                  Lancer une analyse d&apos;olives
                </Text>
                <Text style={[typography.caption, styles.hint]}>
                  Crée une analyse planifiée pour cette récolte.
                </Text>
              </View>

              <Switch
                value={proceedAnalyse}
                onValueChange={setProceedAnalyse}
                trackColor={{ true: colors.olive[500], false: colors.border }}
              />
            </View>

            {/* COÛTS */}
            <Text style={styles.sectionTitle}>Coûts</Text>
            <View style={styles.block}>
              {costs.length === 0 ? (
                <Text style={styles.empty}>Aucun coût enregistré.</Text>
              ) : (
                costs.map((cost) => (
                  <View key={cost.costLineTypeId} style={styles.costRow}>
                    <Text style={styles.rowLabel}>
                      {typeLabel(cost.costLineTypeId)}
                    </Text>
                    <Text style={styles.rowValue}>
                      {formatNumber(cost.totalAmount)} DT
                    </Text>
                  </View>
                ))
              )}

              <View style={styles.separator} />

              <View style={styles.costRow}>
                <Text style={[styles.rowLabel, styles.strong]}>Total</Text>
                <Text style={[styles.rowValue, styles.strong]}>
                  {formatNumber(totalCost)} DT
                </Text>
              </View>

              {costPerKg !== null && (
                <View style={styles.costRow}>
                  <Text style={styles.rowLabel}>Coût par kg</Text>
                  <Text style={styles.rowValue}>
                    {formatNumber(costPerKg)} DT/kg
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

          {error && <Text style={styles.error}>{error}</Text>}

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancel} onPress={onClose}>
              <Text style={[typography.bodyStrong, styles.cancelLabel]}>
                Annuler
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirm, saving && styles.confirmDisabled]}
              onPress={handleConfirm}
              disabled={saving}
            >
              <Text style={[typography.bodyStrong, styles.confirmLabel]}>
                {saving ? "Clôture..." : "Clôturer"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },

  sheet: {
    maxHeight: "90%",
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
    ...shadow.raised,
  },

  handle: {
    width: 40,
    height: 4,
    alignSelf: "center",
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },

  title: {
    color: semanticColors.textPrimary,
  },

  subtitle: {
    color: semanticColors.textSecondary,
    marginTop: spacing.xs,
  },

  scroll: {
    flexGrow: 0,
  },

  sectionTitle: {
    ...typography.label,
    color: semanticColors.textSecondary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textTransform: "uppercase",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },

  sectionTitleInline: {
    marginTop: 0,
    marginBottom: 0,
    flexShrink: 1,
  },

  addStock: {
    ...typography.caption,
    color: semanticColors.primary,
    fontWeight: "700",
  },

  stockInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  ok: {
    color: semanticColors.success,
  },

  warning: {
    color: semanticColors.danger,
  },

  switchBlock: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.lg,
  },

  switchText: {
    flex: 1,
  },

  hint: {
    color: semanticColors.textSecondary,
    marginTop: 2,
  },

  block: {
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    gap: spacing.sm,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  costRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingVertical: 2,
  },

  rowLabel: {
    ...typography.body,
    color: semanticColors.textPrimary,
    flexShrink: 1,
  },

  rowValue: {
    ...typography.body,
    color: semanticColors.textPrimary,
  },

  strong: {
    fontWeight: "700",
  },

  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },

  input: {
    ...typography.bodyStrong,
    minWidth: 110,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    color: semanticColors.textPrimary,
    textAlign: "right",
  },

  empty: {
    ...typography.body,
    color: semanticColors.textSecondary,
  },

  error: {
    ...typography.caption,
    color: semanticColors.danger,
    marginTop: spacing.md,
  },

  actions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg,
  },

  cancel: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.background,
  },

  cancelLabel: {
    color: semanticColors.textSecondary,
  },

  confirm: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: semanticColors.primary,
  },

  confirmDisabled: {
    opacity: 0.6,
  },

  confirmLabel: {
    color: colors.white,
  },
});
