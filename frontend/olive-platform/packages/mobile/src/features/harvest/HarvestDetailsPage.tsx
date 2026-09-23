import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useHarvestDetailsStore } from "@olive-platform/core/features/harvests/stores/HarvestDetailsStore";
import { ProductionStatus } from "@olive-platform/core/features/production/domain/entities/ProductionStatus";
import { Screen } from "../../components/Screen";
import { HarvestMobileTab, HarvestTabs } from "./components/HarvestTabs";
import { HarvestCostsSection } from "./widgets/HarvestCostsSection";
import { CloseHarvestSheet } from "./components/details/CloseHarvestSheet";
import { spacing } from "../../consts/spacing";
import { HarvestDetailsLoading } from "./components/details/HarvestDetailsLoading";
import { HarvestActionCard } from "./components/details/HarvestActionCard";
import { HarvestDetailsHeader } from "./components/details/HarvestDetailsHeader";
import { HarvestSummaryCard } from "./components/details/HarvestSummaryCard";
import { HarvestGeneralSection } from "./components/details/HarvestGeneralSection";

type Props = { harvestId: number };

export function HarvestDetailsPage({ harvestId }: Props) {
  const [activeTab, setActiveTab] = useState<HarvestMobileTab>("general");
  const [closeSheetOpen, setCloseSheetOpen] = useState(false);

  const { harvest, saving, fetchHarvest, start, complete, clear } =
    useHarvestDetailsStore();

  useEffect(() => {
    fetchHarvest(harvestId);
    return () => clear();
  }, [harvestId, fetchHarvest, clear]);

  const isPlanned = harvest?.status === ProductionStatus.Planned;
  const isInProgress = harvest?.status === ProductionStatus.InProgress;

  const handleStart = useCallback(async () => {
    if (!harvest) return;

    try {
      await start(harvest.id);
    } catch {
      Alert.alert("Erreur", "Impossible de lancer la récolte.");
    }
  }, [harvest, start]);

  const handleClose = useCallback(
    async (quantityKg: number, harvestedTrees: number) => {
      if (!harvest) return;

      try {
        await complete(
          harvest.id,
          quantityKg,
          harvestedTrees,
          new Date().toISOString(),
          [],
          false,
        );

        setCloseSheetOpen(false);
      } catch {
        Alert.alert("Erreur", "Impossible de clôturer la récolte.");
      }
    },
    [harvest, complete],
  );

  if (!harvest) {
    return <HarvestDetailsLoading />;
  }

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <HarvestDetailsHeader reference={harvest.reference} />

        <HarvestSummaryCard harvest={harvest} />

        {isPlanned && (
          <HarvestActionCard
            icon="▶"
            title="Lancer la récolte"
            subtitle="Commencer les opérations"
            loading={saving}
            onPress={handleStart}
          />
        )}

        {isInProgress && (
          <HarvestActionCard
            icon="✓"
            title="Clôturer la récolte"
            subtitle="Enregistrer les résultats"
            loading={saving}
            onPress={() => setCloseSheetOpen(true)}
          />
        )}

        <View style={styles.tabs}>
          <HarvestTabs
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </View>

        {activeTab === "general" && (
          <HarvestGeneralSection
            harvest={harvest}
            editable={isPlanned}
          />
        )}

        {activeTab === "costs" && (
          <HarvestCostsSection
            harvestId={harvest.id}
            costs={harvest.costs}
            onAddCost={async (params) => {
              console.log("TODO addCost", params);
            }}
          />
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>

      <CloseHarvestSheet
        visible={closeSheetOpen}
        saving={saving}
        defaultHarvestedTrees={harvest.harvestedTrees}
        onClose={() => setCloseSheetOpen(false)}
        onConfirm={handleClose}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },

  tabs: {
    marginBottom: spacing.xxl,
  },

  bottomSpace: {
    height: spacing.xxl,
  },
});