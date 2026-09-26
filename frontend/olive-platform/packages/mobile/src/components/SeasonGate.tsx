import { ReactNode, useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useSeasonStore } from "../stores/SeasonStore";
import { colors, semanticColors } from "../consts/Colors";
import { typography } from "../consts/Typography";
import { radius, spacing } from "../consts/spacing";

type SeasonGateProps = {
  children: ReactNode;
};

/**
 * Charge les campagnes et n'affiche l'application qu'une fois une campagne
 * sélectionnée : tous les appels d'API partent ainsi avec un seasonId.
 */
export function SeasonGate({ children }: SeasonGateProps) {
  const hydrated = useSeasonStore((state) => state.hydrated);
  const selectedSeasonId = useSeasonStore((state) => state.selectedSeasonId);
  const loaded = useSeasonStore((state) => state.loaded);
  const error = useSeasonStore((state) => state.error);
  const fetchSeasons = useSeasonStore((state) => state.fetchSeasons);

  useEffect(() => {
    if (hydrated) {
      fetchSeasons();
    }
  }, [hydrated, fetchSeasons]);

  if (loaded && selectedSeasonId != null) {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      {error ? (
        <>
          <Text style={styles.text}>{error}</Text>

          <Pressable style={styles.retryButton} onPress={() => fetchSeasons()}>
            <Text style={styles.retryText}>Réessayer</Text>
          </Pressable>
        </>
      ) : (
        <>
          <ActivityIndicator size="large" color={semanticColors.primary} />
          <Text style={styles.text}>Chargement de la campagne...</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xxl,
    backgroundColor: colors.background,
  },
  text: {
    ...typography.body,
    color: semanticColors.textSecondary,
    marginTop: spacing.md,
    textAlign: "center",
  },
  retryButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.olive[700],
  },
  retryText: {
    ...typography.bodyStrong,
    color: colors.white,
  },
});
