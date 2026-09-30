import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import type { PressingOperationDetails } from "@olive-platform/core/features/production/domain/entities/PressingOperationDetails";
import type { PressingParametersDetails } from "@olive-platform/core/features/production/domain/entities/PressingParametersDetails";
import { usePressingOperationInputsStore } from "@olive-platform/core/features/production/stores/PressingOperationInputsStore";
import type { Tank } from "@olive-platform/core/features/tanks/domain/entities/Tank";
import { GetBufferTanks } from "@olive-platform/core/features/tanks/domain/usecases/GetBufferTanks";
import { colors, semanticColors } from "../../../../consts/Colors";
import { typography } from "../../../../consts/Typography";
import { radius, shadow, spacing } from "../../../../consts/spacing";

type Props = {
  visible: boolean;
  saving?: boolean;
  operation: PressingOperationDetails;
  onClose: () => void;
  // Huile produite et citerne tampon qui la reçoit en attendant son analyse.
  onConfirm: (oilQuantityLiters: number, bufferTankId: number) => Promise<void> | void;
};

type ConfigKey = Exclude<keyof PressingParametersDetails, "id" | "processTypeId" | "notes">;

// Réglages affichés dans le récapitulatif (seuls ceux renseignés).
const CONFIG_FIELDS: { key: ConfigKey; label: string; unit: string }[] = [
  { key: "malaxingTemperatureC", label: "Température malaxage", unit: "°C" },
  { key: "malaxingDurationMinutes", label: "Durée malaxage", unit: "min" },
  { key: "malaxingSpeedRpm", label: "Vitesse malaxage", unit: "rpm" },
  { key: "feedRateKgH", label: "Débit d'alimentation", unit: "kg/h" },
  { key: "decanterSpeedRpm", label: "Vitesse décanteur", unit: "rpm" },
  { key: "decanterDifferentialRpm", label: "Différentiel décanteur", unit: "rpm" },
  { key: "centrifugeSpeedRpm", label: "Vitesse centrifugeuse", unit: "rpm" },
  { key: "addedWaterLiters", label: "Eau ajoutée", unit: "L" },
  { key: "waterTemperatureC", label: "Température de l'eau", unit: "°C" },
  { key: "waitingTimeBeforeExtractionMinutes", label: "Attente avant extraction", unit: "min" },
];

const formatNumber = (value: number, digits = 2) =>
  value.toLocaleString("fr-FR", { maximumFractionDigits: digits });

const parseNumber = (value: string) => Number(value.replace(",", ".").trim());

function formatDateTime(value?: string | null) {
  if (!value) return "—";

  return new Date(value).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Récapitulatif avant clôture : opération, lots pressés, configuration,
 * puis saisie de l'huile produite avec rendement et écart à l'attendu.
 */
export function ClosePressingSheet({
  visible,
  saving,
  operation,
  onClose,
  onConfirm,
}: Props) {
  const { inputs, fetchInputs } = usePressingOperationInputsStore();

  const [oilLiters, setOilLiters] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Citernes tampon réelles ; null = en cours de chargement.
  const [bufferTanks, setBufferTanks] = useState<Tank[] | null>(null);
  const [tanksError, setTanksError] = useState<string | null>(null);
  // Choix de l'utilisateur ; à défaut, la citerne conseillée.
  const [pickedTankId, setPickedTankId] = useState<number | null>(null);

  // Lots de l'opération (déjà en cache si l'onglet Intrants a été ouvert).
  useEffect(() => {
    if (visible) fetchInputs(operation.id).catch(() => undefined);
  }, [visible, operation.id, fetchInputs]);

  // Citernes tampon avec leur contenu actuel.
  useEffect(() => {
    if (!visible) return;

    let cancelled = false;

    GetBufferTanks()
      .then((tanks) => {
        if (!cancelled) setBufferTanks(tanks);
      })
      .catch(() => {
        if (!cancelled) setTanksError("Impossible de charger les citernes tampon.");
      });

    return () => {
      cancelled = true;
    };
  }, [visible]);

  const oliveKg = operation.oliveQuantityKg ?? 0;
  const oil = parseNumber(oilLiters);
  const hasOil = oilLiters.trim() !== "" && !Number.isNaN(oil) && oil > 0;

  // Une seule pression par citerne tampon : seule une citerne vide et assez grande convient.
  const unavailableReason = (tank: Tank) => {
    if (Number(tank.currentQuantityLiters) > 0) {
      return tank.pendingPressingNumber
        ? `occupée : ${tank.pendingPressingNumber}`
        : "occupée";
    }
    if (hasOil && Number(tank.capacityLiters) < oil) return "trop petite";
    return null;
  };

  const sortedTanks = [...(bufferTanks ?? [])].sort(
    (a, b) =>
      Number(!!unavailableReason(a)) - Number(!!unavailableReason(b)) ||
      a.code.localeCompare(b.code),
  );
  const suggestedTank = sortedTanks.find((tank) => !unavailableReason(tank)) ?? null;
  const pickedTank = sortedTanks.find((tank) => tank.id === pickedTankId);
  const selectedTank =
    pickedTank && !unavailableReason(pickedTank) ? pickedTank : suggestedTank;

  // Rendement en litres d'huile pour 100 kg d'olives.
  const yieldPercentage = hasOil && oliveKg > 0 ? (oil / oliveKg) * 100 : null;
  const deviation =
    hasOil && operation.expectedOilLiters != null
      ? oil - operation.expectedOilLiters
      : null;

  const configRows = CONFIG_FIELDS.filter(
    (field) => operation.parameters?.[field.key] != null,
  );

  const handleConfirm = async () => {
    Keyboard.dismiss();

    if (!hasOil) {
      setError("La quantité d'huile produite doit être supérieure à 0.");
      return;
    }

    if (!selectedTank) {
      setError("Aucune citerne tampon vide : libérez-en une avant de clôturer.");
      return;
    }

    setError(null);

    try {
      await onConfirm(oil, selectedTank.id);
    } catch (e: any) {
      setError(e?.message ?? "Impossible de clôturer la pression.");
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

          <Text style={[typography.h2, styles.title]}>Clôturer la pression</Text>
          <Text style={[typography.body, styles.subtitle]}>
            Vérifiez le récapitulatif avant de clôturer.
          </Text>

          <ScrollView
            style={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* OPÉRATION */}
            <Text style={styles.sectionTitle}>Opération</Text>
            <View style={styles.block}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Référence</Text>
                <Text style={[styles.rowValue, styles.strong]}>
                  {operation.operationNumber}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.rowLabel}>Début</Text>
                <Text style={styles.rowValue}>{formatDateTime(operation.startTime)}</Text>
              </View>
            </View>

            {/* LOTS PRESSÉS */}
            <Text style={styles.sectionTitle}>Olives pressées</Text>
            <View style={styles.block}>
              {inputs.map((input) => (
                <View key={input.id} style={styles.row}>
                  <Text style={styles.rowLabel}>{input.lotReference || "—"}</Text>
                  <Text style={styles.rowValue}>{formatNumber(input.quantityKg)} kg</Text>
                </View>
              ))}

              {inputs.length > 0 && <View style={styles.separator} />}

              <View style={styles.row}>
                <Text style={[styles.rowLabel, styles.strong]}>
                  Total ({inputs.length} lot{inputs.length > 1 ? "s" : ""})
                </Text>
                <Text style={[styles.rowValue, styles.strong]}>
                  {formatNumber(oliveKg)} kg
                </Text>
              </View>
            </View>

            {/* CONFIGURATION */}
            <Text style={styles.sectionTitle}>Configuration</Text>
            <View style={styles.block}>
              {configRows.length === 0 ? (
                <Text style={styles.empty}>Aucune configuration renseignée.</Text>
              ) : (
                configRows.map((field) => (
                  <View key={field.key} style={styles.row}>
                    <Text style={styles.rowLabel}>{field.label}</Text>
                    <Text style={styles.rowValue}>
                      {formatNumber(Number(operation.parameters?.[field.key]))} {field.unit}
                    </Text>
                  </View>
                ))
              )}
            </View>

            {/* HUILE PRODUITE */}
            <Text style={styles.sectionTitle}>Production</Text>
            <View style={styles.block}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Huile produite (L)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                  value={oilLiters}
                  onChangeText={(value) => {
                    setOilLiters(value);
                    setError(null);
                  }}
                />
              </View>

              <View style={styles.separator} />

              <View style={styles.row}>
                <Text style={styles.rowLabel}>Huile attendue</Text>
                <Text style={styles.rowValue}>
                  {operation.expectedOilLiters != null
                    ? `${formatNumber(operation.expectedOilLiters, 1)} L`
                    : "—"}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.rowLabel}>Rendement</Text>
                <Text style={[styles.rowValue, styles.strong]}>
                  {yieldPercentage != null ? `${formatNumber(yieldPercentage, 1)} %` : "—"}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.rowLabel}>Écart à l&apos;attendu</Text>
                <Text
                  style={[
                    styles.rowValue,
                    styles.strong,
                    deviation != null && (deviation >= 0 ? styles.ok : styles.warning),
                  ]}
                >
                  {deviation != null
                    ? `${deviation >= 0 ? "+" : ""}${formatNumber(deviation, 1)} L`
                    : "—"}
                </Text>
              </View>
            </View>

            {/* CITERNE TAMPON */}
            <Text style={styles.sectionTitle}>Citerne tampon</Text>
            <View style={styles.block}>
              <Text style={styles.empty}>
                L&apos;huile attend ici son analyse, sans être mélangée à une autre pression.
              </Text>

              {tanksError ? (
                <Text style={[styles.empty, styles.warning]}>{tanksError}</Text>
              ) : bufferTanks === null ? (
                <Text style={styles.empty}>Chargement des citernes tampon...</Text>
              ) : sortedTanks.length === 0 ? (
                <Text style={[styles.empty, styles.warning]}>
                  Aucune citerne tampon active.
                </Text>
              ) : (
                sortedTanks.map((tank) => {
                  const reason = unavailableReason(tank);
                  const selected = !reason && tank.id === selectedTank?.id;

                  return (
                    <TouchableOpacity
                      key={tank.id}
                      style={[
                        styles.tank,
                        selected && styles.tankSelected,
                        !!reason && styles.tankDisabled,
                      ]}
                      disabled={!!reason || saving}
                      onPress={() => setPickedTankId(tank.id)}
                    >
                      <View style={[styles.radio, selected && styles.radioSelected]} />

                      <View style={styles.tankBody}>
                        <Text style={[styles.rowLabel, styles.strong]}>
                          {tank.code}
                          {tank.name ? ` · ${tank.name}` : ""}
                          {tank.id === suggestedTank?.id && !reason ? "  (conseillée)" : ""}
                        </Text>
                        <Text style={styles.tankMeta}>
                          {formatNumber(Number(tank.currentQuantityLiters), 0)} /{" "}
                          {formatNumber(Number(tank.capacityLiters), 0)} L
                          {reason ? ` · ${reason}` : " · libre"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}

              {bufferTanks !== null && sortedTanks.length > 0 && !suggestedTank && (
                <Text style={[styles.empty, styles.warning]}>
                  Aucune citerne tampon vide{hasOil ? " assez grande" : ""} : transférez
                  d&apos;abord l&apos;huile d&apos;une pression analysée.
                </Text>
              )}
            </View>

            <View style={styles.notice}>
              <Text style={styles.noticeText}>
                Une fois clôturée, la pression ne pourra plus être modifiée et les
                lots entièrement pressés seront vidés. Une analyse d&apos;huile est
                planifiée automatiquement.
              </Text>
            </View>
          </ScrollView>

          {error && <Text style={styles.error}>{error}</Text>}

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancel} onPress={onClose} disabled={saving}>
              <Text style={[typography.bodyStrong, styles.cancelLabel]}>Annuler</Text>
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
    textAlign: "right",
  },

  strong: {
    fontWeight: "700",
  },

  ok: {
    color: semanticColors.success,
  },

  warning: {
    color: semanticColors.danger,
  },

  empty: {
    ...typography.body,
    color: semanticColors.textSecondary,
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

  tank: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  tankSelected: {
    borderColor: semanticColors.primary,
    backgroundColor: semanticColors.primarySoft,
  },

  tankDisabled: {
    opacity: 0.5,
  },

  tankBody: {
    flex: 1,
    gap: 2,
  },

  tankMeta: {
    ...typography.caption,
    color: semanticColors.textSecondary,
  },

  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.border,
  },

  radioSelected: {
    borderColor: semanticColors.primary,
    backgroundColor: semanticColors.primary,
  },

  notice: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: semanticColors.infoSoft,
  },

  noticeText: {
    ...typography.caption,
    color: semanticColors.info,
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
