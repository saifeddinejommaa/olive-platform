import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { usePressingOperationDetailsStore } from "@olive-platform/core/features/production/stores/PressingOperationDetailsStore";
import { ProductionStatus } from "@olive-platform/core/features/production/domain/entities/ProductionStatus";
import { Screen } from "../../components/Screen";
import { spacing } from "../../consts/spacing";
import { PressingMobileTab, PressingTabs } from "./component/details/PressingTabs";
import { PressingSummaryCard } from "./component/details/PressingSummaryCard";
import { PressingGeneralSection } from "./component/details/PressingGeneralSection";
import { ClosePressingSheet } from "./component/details/ClosePressingSheet";
import { ActionCard } from "../../components/ActionCard";
import { PressingInputsSection } from "./component/details/PressingInputsSection";
import { DetailsHeader } from "../../components/DetailsHeader";
import { Loading } from "../../components/Loading";
import { router } from 'expo-router';

type Props = { operationId: number };

export function PressingOperationDetailsPage({ operationId }: Props) {
  const [activeTab, setActiveTab] = useState<PressingMobileTab>("general");
  const [closeSheetOpen, setCloseSheetOpen] = useState(false);

  const { operation, saving, completing, fetchOperation, startOperation, completeOperation, clear } =
    usePressingOperationDetailsStore();

  useEffect(() => {
    fetchOperation(operationId);
    return () => clear();
  }, [operationId, fetchOperation, clear]);

  const isPlanned = operation?.status === ProductionStatus.Planned;
  const isInProgress = operation?.status === ProductionStatus.InProgress;

  const handleStart = useCallback(async () => {
    if (!operation) return;

    try {
      await startOperation(operation.id);
    } catch (e: any) {
      // Ex. un lot en attente d'analyse : le message de l'API l'explique.
      Alert.alert("Erreur", e?.message ?? "Impossible de lancer le pressurage.");
    }
  }, [operation, startOperation]);

  // Une erreur remonte au récapitulatif, qui l'affiche.
  const handleClose = useCallback(
    async (oilQuantityLiters: number) => {
      if (!operation) return;

      await completeOperation({
        id: operation.id,
        oilQuantity: oilQuantityLiters,
        // Non pris en charge par l'API pour l'instant (aucune analyse créée).
        proceedOilAnalysis: false,
      });

      setCloseSheetOpen(false);
    },
    [operation, completeOperation],
  );

  // La configuration de pression est obligatoire avant la clôture.
  const handleOpenCloseSheet = useCallback(() => {
    const parameters = operation?.parameters;
    const hasConfiguration =
      !!parameters &&
      Object.entries(parameters).some(
        ([key, value]) =>
          key !== "id" && key !== "notes" && value !== null && value !== undefined,
      );

    if (!hasConfiguration) {
      setActiveTab("general");
      Alert.alert(
        "Configuration requise",
        "Renseignez la configuration de pression (onglet Général, « Modifier ») avant de clôturer.",
      );
      return;
    }

    setCloseSheetOpen(true);
  }, [operation]);

  if (!operation) {
    return <Loading />;
  }

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <DetailsHeader title ="Détails" onBack={()=>{ router.back()}} />

        <PressingSummaryCard operation={operation} />

        {isPlanned && (
          <ActionCard
            icon="▶"
            title="Lancer le pressurage"
            subtitle="Commencer les opérations"
            loading={saving}
            onPress={handleStart}
          />
        )}

        {isInProgress && (
          <ActionCard
            icon="✓"
            title="Clôturer le pressurage"
            subtitle="Enregistrer les résultats"
            loading={saving}
            onPress={handleOpenCloseSheet}
          />
        )}

        <View style={styles.tabs}>
          <PressingTabs activeTab={activeTab} onChange={setActiveTab} />
        </View>

        {activeTab === "general" && (
          <PressingGeneralSection operation={operation} />
        )}

        {activeTab === "inputs" && (
          <PressingInputsSection operationId={operation.id} status={operation.status}/>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>

      {closeSheetOpen && (
        <ClosePressingSheet
          visible
          saving={completing}
          operation={operation}
          onClose={() => setCloseSheetOpen(false)}
          onConfirm={handleClose}
        />
      )}
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