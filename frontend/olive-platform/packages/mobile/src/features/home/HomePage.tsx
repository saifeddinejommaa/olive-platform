import { useCallback, type ComponentType } from "react";
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect, type Href } from "expo-router";
import {
  IconBasket,
  IconDroplet,
  IconFlask2,
  IconPackages,
} from "@tabler/icons-react-native";

import { SeasonSelector } from "../../components/SeasonSelector";
import { colors, semanticColors } from "../../consts/Colors";
import { typography } from "../../consts/Typography";
import { radius, shadow, spacing } from "../../consts/spacing";
import { useTodos } from "./useTodos";

type Line = { label: string; count: number };

type Tile = {
  key: string;
  title: string;
  icon: ComponentType<{ size?: number; color?: string }>;
  color: string;
  background: string;
  // Chiffre principal et son libellé.
  value: string;
  caption: string;
  lines: Line[];
  href: Href;
};

const formatKg = (value: number) =>
  `${Number(value).toLocaleString("fr-FR", { maximumFractionDigits: 0 })}`;

/**
 * Accueil : une carte par domaine avec ce qu'il reste à faire sur la
 * campagne. Un appui ouvre l'onglet correspondant.
 */
export function HomePage() {
  const { summary, loading, failed, load } = useTodos();

  // Rechargé à chaque retour sur l'onglet (ex. après une pression clôturée).
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const { harvests, pressings, analyses, readyOlives } = summary;

  const tiles: Tile[] = [
    {
      key: "harvests",
      title: "Récoltes",
      icon: IconBasket,
      color: colors.olive[700],
      background: colors.olive[100],
      value: String(harvests.toStart + harvests.toClose),
      caption: "en attente",
      lines: [
        { label: "à lancer", count: harvests.toStart },
        { label: "à clôturer", count: harvests.toClose },
      ],
      href: "/recolte",
    },
    {
      key: "pressings",
      title: "Pressions",
      icon: IconDroplet,
      color: colors.gold[700],
      background: colors.gold[100],
      value: String(pressings.toStart + pressings.toClose),
      caption: "en attente",
      lines: [
        { label: "à lancer", count: pressings.toStart },
        { label: "à clôturer", count: pressings.toClose },
      ],
      href: "/production",
    },
    {
      key: "analyses",
      title: "Analyses",
      icon: IconFlask2,
      color: colors.teal[700],
      background: colors.teal[100],
      value: String(analyses.olive + analyses.oil + analyses.oilToTransfer),
      caption: "en attente",
      lines: [
        { label: "d'olive", count: analyses.olive },
        { label: "d'huile", count: analyses.oil },
        { label: "huile à transférer", count: analyses.oilToTransfer },
      ],
      href: "/analyses",
    },
    {
      key: "ready",
      title: "Olives prêtes",
      icon: IconPackages,
      color: colors.rust[600],
      background: colors.rust[100],
      value: formatKg(readyOlives.kg),
      caption: "kg à presser",
      lines: [{ label: `lot${readyOlives.lots > 1 ? "s" : ""} analysé${readyOlives.lots > 1 ? "s" : ""}`, count: readyOlives.lots }],
      href: "/production/new",
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
    >
      {/* Bandeau : même en-tête que les autres onglets, sans titre */}
      <View style={styles.banner}>
        <SeasonSelector />
      </View>

      {/* Cartes : chevauchent le bas du bandeau */}
      <View style={styles.content}>
        {failed && !loading && (
          <Text style={[typography.body, styles.error]}>
            Impossible de charger les données. Tirez vers le bas pour réessayer.
          </Text>
        )}

        <View style={styles.grid}>
          {tiles.map((tile) => (
            <TileCard key={tile.key} tile={tile} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function TileCard({ tile }: { tile: Tile }) {
  const Icon = tile.icon;

  return (
    <Pressable
      style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
      onPress={() => router.push(tile.href)}
    >
      <View style={[styles.iconCircle, { backgroundColor: tile.background }]}>
        <Icon size={22} color={tile.color} />
      </View>

      <Text style={[typography.bodyStrong, styles.primaryText]}>{tile.title}</Text>

      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: tile.color }]}>{tile.value}</Text>
        <Text style={[typography.caption, styles.muted]}>{tile.caption}</Text>
      </View>

      <View style={styles.lines}>
        {tile.lines.map((line) => (
          <View key={line.label} style={styles.line}>
            <View
              style={[
                styles.dot,
                { backgroundColor: line.count > 0 ? tile.color : colors.border },
              ]}
            />
            <Text style={[typography.caption, line.count > 0 ? styles.primaryText : styles.muted]}>
              {line.count} {line.label}
            </Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  // Mêmes dimensions que le bandeau de ListScreen.
  banner: {
    backgroundColor: colors.olive[800],
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxxl + spacing.xl,
  },
  content: {
    marginTop: -spacing.xxxl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: spacing.md,
  },
  tile: {
    width: "48.5%",
    minHeight: 190,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: semanticColors.surface,
    borderWidth: 1,
    borderColor: semanticColors.border,
    gap: spacing.sm,
    ...shadow.card,
  },
  tilePressed: { opacity: 0.7 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  valueRow: { flexDirection: "row", alignItems: "baseline", gap: spacing.xs },
  value: { fontSize: 30, fontWeight: "700" },
  lines: { gap: 4, marginTop: "auto" },
  line: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  dot: { width: 6, height: 6, borderRadius: 3 },
  primaryText: { color: semanticColors.textPrimary },
  muted: { color: semanticColors.textSecondary },
  error: { color: semanticColors.danger },
});
