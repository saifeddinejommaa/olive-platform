import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { IconSquare, IconSquareCheck, IconTrash } from "@tabler/icons-react-native";

import { GetHarvestStocks } from "@olive-platform/core/features/harvests/domain/usecases/GetHarvestStocks";
import { GetOlivePurchaseItems } from "@olive-platform/core/features/olivePurchases/domain/usecases/GetOlivePurchaseItems";
import { SkipOliveLotAnalysis } from "@olive-platform/core/features/oliveLots/domain/usecases/SkipOliveLotAnalysis";
import { getOliveVarietyLabel } from "@olive-platform/core/features/appConstants/helper/AppConstantsHelper";

import {
  PressingSourceSelector,
  type PressingSource,
  type PressingSourceType,
} from "./PressingSourceSelector";
import { colors, semanticColors } from "../../../../consts/Colors";
import { typography } from "../../../../consts/Typography";
import { radius, spacing } from "../../../../consts/spacing";

// Lot d'olives proposé à la pression (stock de récolte ou ligne d'achat).
export type PressingLot = {
  id: number;
  reference: string;
  details: string | null;
  quantityKg: number;
  remainingKg: number;
  isPressable: boolean;
  toAnalysis: boolean;
};

export type PressingSourceBlock = {
  key: string;
  sourceType: PressingSourceType;
  source: PressingSource | null;
  lots: PressingLot[];
  selectedLotIds: number[];
};

type Props = {
  index: number;
  block: PressingSourceBlock;
  excludedSourceIds: number[];
  canRemove: boolean;
  onChange: (block: PressingSourceBlock) => void;
  onRemove: () => void;
};

// Statuts Disponible / Partiellement utilisé.
const isSelectableStatus = (status: number) => status === 1 || status === 2;

const formatKg = (value: number) => `${value.toLocaleString("fr-FR")} kg`;

// Lots avec du restant ; ceux en attente d'analyse restent visibles (grisés).
async function loadLots(
  sourceType: PressingSourceType,
  sourceId: number,
): Promise<PressingLot[]> {
  if (sourceType === "harvest") {
    const stocks = await GetHarvestStocks(sourceId);

    return stocks
      .filter((stock) => stock.remainingKg > 0 && isSelectableStatus(stock.status))
      .map((stock) => ({
        id: stock.id,
        reference: stock.reference,
        details: stock.varietyId ? getOliveVarietyLabel(stock.varietyId) : null,
        quantityKg: stock.quantityKg,
        remainingKg: stock.remainingKg,
        isPressable: stock.isPressable,
        toAnalysis: stock.toAnalysis,
      }));
  }

  const items = await GetOlivePurchaseItems(sourceId);

  return items
    .filter((item) => item.remainingQuantityKg > 0 && isSelectableStatus(item.status))
    .map((item) => ({
      id: item.id,
      reference: item.reference,
      details: item.variety ? getOliveVarietyLabel(Number(item.variety)) : null,
      quantityKg: item.agreedQuantityKg,
      remainingKg: item.remainingQuantityKg,
      isPressable: item.isPressable,
      toAnalysis: item.toAnalysis,
    }));
}

export function PressingSourceCard({
  index,
  block,
  excludedSourceIds,
  canRemove,
  onChange,
  onRemove,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skippingId, setSkippingId] = useState<number | null>(null);
  // Incrémenté pour recharger les lots (ex. après « Passer sans analyse »).
  const [version, setVersion] = useState(0);

  const sourceId = block.source?.id ?? null;

  useEffect(() => {
    if (!sourceId) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const lots = await loadLots(block.sourceType, sourceId);

        if (!cancelled) {
          // Garde uniquement les lots encore sélectionnables.
          const pressableIds = lots
            .filter((lot) => lot.isPressable)
            .map((lot) => lot.id);

          onChange({
            ...block,
            lots,
            selectedLotIds: block.selectedLotIds.filter((id) =>
              pressableIds.includes(id),
            ),
          });
        }
      } catch {
        if (!cancelled) setError("Impossible de charger les lots.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
    // Rechargé au changement de source ou après « Passer sans analyse ».
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block.sourceType, sourceId, version]);

  const pressableLots = block.lots.filter((lot) => lot.isPressable);
  const allSelected =
    pressableLots.length > 0 &&
    block.selectedLotIds.length === pressableLots.length;

  const selectedKg = block.lots
    .filter((lot) => block.selectedLotIds.includes(lot.id))
    .reduce((total, lot) => total + lot.remainingKg, 0);

  const changeType = (sourceType: PressingSourceType) => {
    if (sourceType === block.sourceType) return;

    onChange({
      ...block,
      sourceType,
      source: null,
      lots: [],
      selectedLotIds: [],
    });
  };

  const selectSource = (source: PressingSource) => {
    onChange({ ...block, source, lots: [], selectedLotIds: [] });
  };

  const toggleLot = (lotId: number) => {
    const selectedLotIds = block.selectedLotIds.includes(lotId)
      ? block.selectedLotIds.filter((id) => id !== lotId)
      : [...block.selectedLotIds, lotId];

    onChange({ ...block, selectedLotIds });
  };

  const toggleAll = () => {
    onChange({
      ...block,
      selectedLotIds: allSelected ? [] : pressableLots.map((lot) => lot.id),
    });
  };

  const skipAnalysis = async (lotId: number) => {
    setSkippingId(lotId);
    setError(null);

    try {
      await SkipOliveLotAnalysis(lotId);
      setVersion((current) => current + 1);
    } catch (e: any) {
      setError(e?.message ?? "Impossible de passer le lot sans analyse.");
    } finally {
      setSkippingId(null);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={[typography.bodyStrong, styles.headerTitle]}>
          Source {index + 1}
        </Text>

        {canRemove && (
          <Pressable onPress={onRemove} hitSlop={8}>
            <IconTrash size={20} color={semanticColors.danger} />
          </Pressable>
        )}
      </View>

      {/* TYPE DE SOURCE */}
      <View style={styles.segment}>
        {(["harvest", "purchase"] as const).map((type) => {
          const selected = block.sourceType === type;

          return (
            <Pressable
              key={type}
              onPress={() => changeType(type)}
              style={[styles.segmentItem, selected && styles.segmentItemSelected]}
            >
              <Text
                style={[
                  typography.bodyStrong,
                  styles.segmentLabel,
                  selected && styles.segmentLabelSelected,
                ]}
              >
                {type === "harvest" ? "Récolte" : "Achat"}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* SOURCE */}
      <Text style={styles.label}>
        {block.sourceType === "harvest" ? "Récolte *" : "Achat *"}
      </Text>
      <PressingSourceSelector
        sourceType={block.sourceType}
        value={block.source}
        excludedIds={excludedSourceIds}
        onChange={selectSource}
      />

      {/* LOTS */}
      {block.source && (
        <>
          <View style={styles.lotsHeader}>
            <Text style={styles.label}>Lots à presser *</Text>

            {pressableLots.length > 0 && (
              <Pressable onPress={toggleAll} hitSlop={8}>
                <Text style={[typography.caption, styles.link]}>
                  {allSelected ? "Tout désélectionner" : "Tout sélectionner"}
                </Text>
              </Pressable>
            )}
          </View>

          {loading && (
            <ActivityIndicator
              style={styles.loader}
              color={semanticColors.primary}
            />
          )}

          {!loading && block.lots.length === 0 && !error && (
            <Text style={styles.hint}>Aucun lot disponible pour cette source.</Text>
          )}

          {!loading &&
            block.lots.map((lot) => {
              const selected = block.selectedLotIds.includes(lot.id);
              const blocked = !lot.isPressable;

              return (
                <Pressable
                  key={lot.id}
                  disabled={blocked}
                  onPress={() => toggleLot(lot.id)}
                  style={[
                    styles.lot,
                    selected && styles.lotSelected,
                    blocked && styles.lotBlocked,
                  ]}
                >
                  {selected ? (
                    <IconSquareCheck size={22} color={semanticColors.primary} />
                  ) : (
                    <IconSquare
                      size={22}
                      color={blocked ? colors.textMuted : semanticColors.textSecondary}
                    />
                  )}

                  <View style={styles.lotText}>
                    <Text
                      style={[
                        typography.bodyStrong,
                        styles.lotReference,
                        blocked && styles.lotTextBlocked,
                      ]}
                    >
                      {lot.reference}
                    </Text>

                    {lot.details && (
                      <Text style={[typography.caption, styles.lotMeta]}>
                        {lot.details}
                      </Text>
                    )}

                    {blocked && (
                      <View style={styles.pendingRow}>
                        <Text style={[typography.caption, styles.pendingBadge]}>
                          En attente d&apos;analyse
                        </Text>

                        <Pressable
                          onPress={() => skipAnalysis(lot.id)}
                          disabled={skippingId === lot.id}
                          style={styles.skipButton}
                        >
                          <Text style={[typography.caption, styles.skipLabel]}>
                            {skippingId === lot.id ? "..." : "Passer sans analyse"}
                          </Text>
                        </Pressable>
                      </View>
                    )}
                  </View>

                  <Text
                    style={[
                      typography.bodyStrong,
                      styles.lotQuantity,
                      blocked && styles.lotTextBlocked,
                    ]}
                  >
                    {lot.remainingKg < lot.quantityKg
                      ? `${lot.remainingKg} / ${formatKg(lot.quantityKg)}`
                      : formatKg(lot.quantityKg)}
                  </Text>
                </Pressable>
              );
            })}

          {error && <Text style={styles.error}>{error}</Text>}

          {block.selectedLotIds.length > 0 && (
            <Text style={styles.hint}>
              {block.selectedLotIds.length} lot
              {block.selectedLotIds.length > 1 ? "s" : ""} · {formatKg(selectedKg)}
            </Text>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },

  headerTitle: {
    color: semanticColors.textPrimary,
  },

  segment: {
    flexDirection: "row",
    gap: spacing.sm,
  },

  segmentItem: {
    flex: 1,
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },

  segmentItemSelected: {
    borderColor: colors.olive[500],
    backgroundColor: colors.olive[100],
  },

  segmentLabel: {
    color: semanticColors.textSecondary,
  },

  segmentLabelSelected: {
    color: colors.olive[800],
  },

  label: {
    ...typography.label,
    color: semanticColors.textSecondary,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },

  lotsHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  link: {
    color: semanticColors.primary,
    marginBottom: spacing.xs,
  },

  loader: {
    paddingVertical: spacing.md,
  },

  hint: {
    ...typography.caption,
    color: semanticColors.textSecondary,
    marginTop: spacing.sm,
  },

  lot: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    marginTop: spacing.sm,
  },

  lotSelected: {
    borderColor: colors.olive[500],
    backgroundColor: colors.olive[100],
  },

  lotBlocked: {
    backgroundColor: colors.background,
  },

  lotText: {
    flex: 1,
  },

  lotReference: {
    color: semanticColors.textPrimary,
  },

  lotTextBlocked: {
    color: colors.textMuted,
  },

  lotMeta: {
    color: semanticColors.textSecondary,
    marginTop: 2,
  },

  lotQuantity: {
    color: semanticColors.textPrimary,
  },

  pendingRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },

  pendingBadge: {
    color: colors.gold[700],
    backgroundColor: colors.gold[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    overflow: "hidden",
  },

  skipButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },

  skipLabel: {
    color: semanticColors.textPrimary,
  },

  error: {
    ...typography.caption,
    color: semanticColors.danger,
    marginTop: spacing.sm,
  },
});
