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
type Props = { operationId: number };

export function PressingOperationDetailsPage({ operationId }: Props) {
  const [activeTab, setActiveTab] = useState<PressingMobileTab>("general");
  const [closeSheetOpen, setCloseSheetOpen] = useState(false);

  const { operation, saving, fetchOperation, startOperation, completeOperation, clear } =
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
    } catch {
      Alert.alert("Erreur", "Impossible de lancer le pressurage.");
    }
  }, [operation, startOperation]);

  const handleClose = useCallback(
    async (operationNumber: string, oilQuantityLiters: number) => {
      if (!operation) return;

      try {
        await completeOperation({
          id: operation.id,
          oilQuantity: oilQuantityLiters,
          proceedOilAnalysis: true
      });

        setCloseSheetOpen(false);
      } catch {
        Alert.alert("Erreur", "Impossible de clôturer le pressurage.");
      }
    },
    [operation, completeOperation],
  );

  if (!operation) {
    return <Loading />;
  }

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <DetailsHeader title ="Détails" onBack={()=>{}} />

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
            onPress={() => setCloseSheetOpen(true)}
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

      <ClosePressingSheet
        visible={closeSheetOpen}
        saving={saving}
        defaultOperationNumber={operation.operationNumber}
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