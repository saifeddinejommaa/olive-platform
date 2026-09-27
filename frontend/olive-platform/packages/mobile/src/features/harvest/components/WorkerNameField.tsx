import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { IconUser } from "@tabler/icons-react-native";

import type { WorkerSuggestion } from "@olive-platform/core/features/harvests/domain/entities/WorkerSuggestion";
import { searchWorkers } from "@olive-platform/core/features/harvests/domain/usecases/SearchWorkers";
import { colors, semanticColors } from "../../../consts/Colors";
import { typography } from "../../../consts/Typography";
import { radius, spacing } from "../../../consts/spacing";

const SEARCH_DELAY_MS = 300;
const MIN_SEARCH_LENGTH = 2;

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  onSelect: (worker: WorkerSuggestion) => void;
  placeholder?: string;
};

export function WorkerNameField({
  value,
  onChangeText,
  onSelect,
  placeholder = "Nom de l'ouvrier",
}: Props) {
  const [suggestions, setSuggestions] = useState<WorkerSuggestion[]>([]);
  const [searching, setSearching] = useState(false);

  const requestId = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelPendingSearch = () => {
    requestId.current++;

    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const cancelHide = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  useEffect(
    () => () => {
      cancelPendingSearch();
      cancelHide();
    },
    [],
  );

  // Masquage différé : le blur arrive avant le tap sur une suggestion,
  // la liste doit rester en place le temps que la sélection soit prise en compte.
  const handleBlur = () => {
    cancelHide();
    hideTimer.current = setTimeout(() => setSuggestions([]), 250);
  };

  // La recherche part de la saisie (et non d'un effet) : une sélection
  // ne relance donc pas de recherche.
  const handleChangeText = (text: string) => {
    onChangeText(text);
    cancelPendingSearch();

    const search = text.trim();

    if (search.length < MIN_SEARCH_LENGTH) {
      setSuggestions([]);
      setSearching(false);
      return;
    }

    const currentRequest = requestId.current;

    timer.current = setTimeout(async () => {
      setSearching(true);

      try {
        const result = await searchWorkers(search);

        // Ignore les réponses d'une saisie précédente.
        if (currentRequest === requestId.current) {
          setSuggestions(result);
        }
      } catch {
        if (currentRequest === requestId.current) {
          setSuggestions([]);
        }
      } finally {
        if (currentRequest === requestId.current) {
          setSearching(false);
        }
      }
    }, SEARCH_DELAY_MS);
  };

  const handleSelect = (worker: WorkerSuggestion) => {
    cancelPendingSearch();
    cancelHide();
    setSuggestions([]);
    setSearching(false);
    onSelect(worker);
    Keyboard.dismiss();
  };

  const showSuggestions = suggestions.length > 0;

  return (
    <View>
      <View style={styles.inputWrapper}>
        <IconUser size={18} color={semanticColors.textSecondary} />

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={handleChangeText}
          onFocus={cancelHide}
          onBlur={handleBlur}
          autoCorrect={false}
          autoCapitalize="words"
        />

        {searching && (
          <ActivityIndicator size="small" color={semanticColors.primary} />
        )}
      </View>

      {showSuggestions && (
        <View style={styles.suggestions}>
          {suggestions.map((worker) => (
            <Pressable
              key={`${worker.workerName}|${worker.workerIdentifier ?? ""}`}
              onPress={() => handleSelect(worker)}
              style={({ pressed }) => [
                styles.suggestion,
                pressed && styles.suggestionPressed,
              ]}
            >
              <Text style={[typography.body, styles.suggestionName]}>
                {worker.workerName}
              </Text>

              {worker.workerIdentifier && (
                <Text style={[typography.caption, styles.suggestionId]}>
                  {worker.workerIdentifier}
                </Text>
              )}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },

  input: {
    ...typography.body,
    flex: 1,
    paddingVertical: spacing.sm,
    color: semanticColors.textPrimary,
  },

  suggestions: {
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },

  suggestion: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },

  suggestionPressed: {
    backgroundColor: colors.olive[100],
  },

  suggestionName: {
    color: semanticColors.textPrimary,
    flex: 1,
  },

  suggestionId: {
    color: semanticColors.textSecondary,
    marginLeft: spacing.sm,
  },
});
