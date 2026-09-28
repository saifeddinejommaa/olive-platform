import { StyleSheet, Text, TextInput, View } from "react-native";

import { colors, semanticColors } from "../../../../consts/Colors";
import { typography } from "../../../../consts/Typography";
import { radius, shadow, spacing } from "../../../../consts/spacing";
import { HarvestSectionHeader } from "../../../harvest/components/details/HarvestSectionHeader";

export type ResultField =
  | "humidityPercentage"
  | "waterPercentage"
  | "oilPercentage"
  | "acidityPercentage";

// Valeurs saisies (texte) ; converties en nombre à l'enregistrement.
export type ResultsForm = Record<ResultField, string>;

export const RESULT_FIELDS: { key: ResultField; label: string }[] = [
  { key: "oilPercentage", label: "Taux d'huile" },
  { key: "acidityPercentage", label: "Taux d'acidité" },
  { key: "humidityPercentage", label: "Taux d'humidité" },
  { key: "waterPercentage", label: "Taux d'eau" },
];

type Props = {
  form: ResultsForm;
  // Saisie possible uniquement pendant l'analyse.
  editable: boolean;
  // Analyse planifiée : les résultats ne sont pas encore saisissables.
  notStarted: boolean;
  errors: Partial<Record<ResultField, string>>;
  onChange: (field: ResultField, value: string) => void;
};

export function OliveAnalysisResultsSection({
  form,
  editable,
  notStarted,
  errors,
  onChange,
}: Props) {
  return (
    <View>
      <HarvestSectionHeader
        title="Résultats"
        subtitle={
          editable
            ? "Saisissez les taux mesurés (en %)"
            : "Taux mesurés sur l'échantillon"
        }
      />

      <View style={styles.card}>
        {notStarted ? (
          <Text style={[typography.body, styles.hint]}>
            Démarrez l&apos;analyse pour saisir les résultats.
          </Text>
        ) : (
          RESULT_FIELDS.map((field, index) => (
            <View
              key={field.key}
              style={[styles.row, index === RESULT_FIELDS.length - 1 && styles.lastRow]}
            >
              <Text style={[typography.body, styles.label]}>{field.label}</Text>

              {editable ? (
                <View style={styles.inputWrap}>
                  <TextInput
                    style={[styles.input, errors[field.key] && styles.inputError]}
                    keyboardType="decimal-pad"
                    placeholder="0"
                    placeholderTextColor={colors.textMuted}
                    value={form[field.key]}
                    onChangeText={(value) => onChange(field.key, value)}
                  />
                  <Text style={[typography.body, styles.unit]}>%</Text>
                </View>
              ) : (
                <Text style={[typography.bodyStrong, styles.value]}>
                  {form[field.key] ? `${form[field.key].replace(".", ",")} %` : "—"}
                </Text>
              )}

              {errors[field.key] && (
                <Text style={styles.error}>{errors[field.key]}</Text>
              )}
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: semanticColors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: semanticColors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    ...shadow.card,
  },
  hint: {
    color: semanticColors.textSecondary,
    paddingVertical: spacing.md,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  label: {
    color: semanticColors.textSecondary,
  },
  value: {
    color: semanticColors.textPrimary,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  input: {
    ...typography.body,
    width: 96,
    minHeight: 42,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    color: semanticColors.textPrimary,
    textAlign: "right",
  },
  inputError: {
    borderColor: semanticColors.danger,
  },
  unit: {
    color: semanticColors.textSecondary,
  },
  error: {
    ...typography.caption,
    color: semanticColors.danger,
    width: "100%",
    textAlign: "right",
    marginTop: spacing.xs,
  },
});
