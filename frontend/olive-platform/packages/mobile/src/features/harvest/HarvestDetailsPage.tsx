import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useHarvestDetailsStore } from "@olive-platform/core/features/harvests/stores/HarvestDetailsStore";
import { ProductionStatus } from "@olive-platform/core/features/production/domain/entities/ProductionStatus";
import { Screen } from "../../components/Screen";
import { HarvestCostsSection } from "./widgets/HarvestCostsSection";
import {
  CloseHarvestSheet,
  type CloseHarvestSheetResult,
} from "./components/details/CloseHarvestSheet";
import { spacing } from "../../consts/spacing";
import { HarvestSummaryCard } from "./components/details/HarvestSummaryCard";
import { HarvestGeneralSection } from "./components/details/HarvestGeneralSection";
import { HarvestMobileTab, HarvestTabs } from "./components/details/HarvestTabs";
import { Loading } from "../../components/Loading";
import { DetailsHeader } from "../../components/DetailsHeader";
import { ActionCard } from "../../components/ActionCard";
import { router } from 'expo-router';

type Props = { harvestId: number };

export function HarvestDetailsPage({ harvestId }: Props) {
  const [activeTab, setActiveTab] = useState<HarvestMobileTab>("general");
  const [closeSheetOpen, setCloseSheetOpen] = useState(false);
  // Nouvelle clé à chaque ouverture : le récapitulatif repart des valeurs à jour.
  const [closeSheetKey, setCloseSheetKey] = useState(0);

  const openCloseSheet = () => {
    setCloseSheetKey((key) => key + 1);
    setCloseSheetOpen(true);
  };

  const { harvest, saving, fetchHarvest, start, complete, addCostLine, clear } =
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
    async ({
      quantityKg,
      harvestedTrees,
      stocks,
      proceedAnalyse,
    }: CloseHarvestSheetResult) => {
      if (!harvest) return;

      // Une erreur est remontée à la feuille, qui affiche le message.
      await complete(
        harvest.id,
        quantityKg,
        harvestedTrees,
        new Date().toISOString(),
        stocks,
        proceedAnalyse,
      );

      setCloseSheetOpen(false);
    },
    [harvest, complete],
  );

  if (!harvest) {
    return <Loading />;
  }

  return (
    <Screen>
      {/* keyboardShouldPersistTaps : les feuilles (coût, clôture) sont des
          enfants React de ce ScrollView. Sans ce réglage, il intercepte le
          premier tap pour fermer le clavier (suggestion, bouton non déclenchés). */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <DetailsHeader title="Détails Récole" onBack={()=> { router.back()}}/>

        <HarvestSummaryCard harvest={harvest} />

        {isPlanned && (
          <ActionCard
            icon="▶"
            title="Lancer la récolte"
            subtitle="Commencer les opérations"
            loading={saving}
            onPress={handleStart}
          />
        )}

        {isInProgress && (
          <ActionCard
            icon="✓"
            title="Clôturer la récolte"
            subtitle="Enregistrer les résultats"
            loading={saving}
            onPress={openCloseSheet}
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
            savingCost={saving}
            canAddCost={isInProgress || harvest.status === ProductionStatus.Completed}
            addCostDisabledMessage={
              isPlanned
                ? "Les coûts pourront être ajoutés une fois la récolte lancée."
                : undefined
            }
            onAddCost={(params) => addCostLine(harvest.id, params)}
          />
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>

      <CloseHarvestSheet
        key={closeSheetKey}
        visible={closeSheetOpen}
        saving={saving}
        harvest={harvest}
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