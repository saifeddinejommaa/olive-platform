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
import {
  formatDate,
  getTodayDate,
  toDateOnlyString,
} from "@olive-platform/core/features/shared/utils/DatesUtils";
import { HarvestWeatherAdvice } from "./components/HarvestWeatherAdvice";
import { HarvestStartWeatherCard } from "./components/HarvestStartWeatherCard";
import { WeatherRepository } from "@olive-platform/core/features/weather/data/repositories/WeatherRepository";

type Props = { harvestId: number };

export function HarvestDetailsPage({ harvestId }: Props) {
  const [activeTab, setActiveTab] = useState<HarvestMobileTab>("general");
  const [closeSheetOpen, setCloseSheetOpen] = useState(false);
  // Nouvelle clé à chaque ouverture : le récapitulatif repart des valeurs à jour.
  const [closeSheetKey, setCloseSheetKey] = useState(0);
  const [checkingWeather, setCheckingWeather] = useState(false);

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

  // Pas de lancement avant le jour prévu (règle vérifiée aussi par l'API).
  const startsLater =
    !!harvest?.plannedDate &&
    toDateOnlyString(new Date(harvest.plannedDate)) > getTodayDate();

  const launch = useCallback(
    async (weatherAcknowledged: boolean) => {
      if (!harvest) return;

      try {
        await start(harvest.id, weatherAcknowledged);
      } catch {
        Alert.alert("Erreur", "Impossible de lancer la récolte.");
      }
    },
    [harvest, start],
  );

  // Météo du jour d'abord : si elle est défavorable, l'utilisateur confirme.
  const handleStart = useCallback(async () => {
    if (!harvest) return;

    setCheckingWeather(true);

    const advice = await WeatherRepository.getHarvestStartCheck(harvest.id)
      // Météo indisponible : on ne bloque pas le lancement.
      .catch(() => null)
      .finally(() => setCheckingWeather(false));

    if (advice && (advice.level === "warning" || advice.level === "danger")) {
      Alert.alert(
        "Météo défavorable",
        advice.warnings.map((warning) => `• ${warning.message}`).join("\n\n"),
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Lancer quand même",
            style: "destructive",
            onPress: () => launch(true),
          },
        ],
      );
      return;
    }

    await launch(false);
  }, [harvest, launch]);

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
            subtitle={
              startsLater
                ? `Prévue le ${formatDate(harvest.plannedDate)} : lancement possible à partir de cette date`
                : "Commencer les opérations"
            }
            disabled={startsLater}
            loading={saving || checkingWeather}
            onPress={handleStart}
          />
        )}

        {/* Récolte planifiée : conseil météo, affiné à l'approche de la date. */}
        {isPlanned && harvest.plannedDate && (
          <View style={styles.weather}>
            <HarvestWeatherAdvice
              plotId={harvest.plotId}
              date={toDateOnlyString(new Date(harvest.plannedDate))}
            />
          </View>
        )}

        {harvest.startWeather && (
          <View style={styles.weather}>
            <HarvestStartWeatherCard weather={harvest.startWeather} />
          </View>
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

        {/* Récolte terminée avec des lots à presser : ouvre « Nouvelle pression ». */}
        {harvest.canBePressed && (
          <ActionCard
            icon="⚙"
            title="Lancer la pression"
            subtitle="Presser les lots de cette récolte"
            onPress={() =>
              router.push({
                pathname: "/production/new",
                params: { harvestId: String(harvest.id) },
              })
            }
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

  weather: {
    marginBottom: spacing.xl,
  },
  tabs: {
    marginBottom: spacing.xxl,
  },

  bottomSpace: {
    height: spacing.xxl,
  },
});