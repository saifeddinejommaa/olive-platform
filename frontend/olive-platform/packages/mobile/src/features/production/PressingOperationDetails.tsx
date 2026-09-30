import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { usePressingOperationDetailsStore } from "@olive-platform/core/features/production/stores/PressingOperationDetailsStore";
import { ProductionStatus } from "@olive-platform/core/features/production/domain/entities/ProductionStatus";
import { Screen } from "../../components/Screen";
import { radius, spacing } from "../../consts/spacing";
import { semanticColors } from "../../consts/Colors";
import { typography } from "../../consts/Typography";
import { usePressingOperationInputsStore } from "@olive-platform/core/features/production/stores/PressingOperationInputsStore";
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

  const { inputs, fetchInputs } = usePressingOperationInputsStore();

  useEffect(() => {
    fetchOperation(operationId);
    // Lots de la pression : on vérifie qu'aucun n'attend son analyse.
    fetchInputs(operationId).catch(() => undefined);
    return () => clear();
  }, [operationId, fetchOperation, fetchInputs, clear]);

  const isPlanned = operation?.status === ProductionStatus.Planned;
  const isInProgress = operation?.status === ProductionStatus.InProgress;

  // Analyse obligatoire et pas encore terminée : la pression ne se lance ni ne
  // se clôture (l'API le refuse aussi).
  const lotsAwaitingAnalysis = inputs.filter(
    (input) =>
      input.needAnalysis && input.analysis?.status !== ProductionStatus.Completed,
  );
  const awaitsAnalysis = lotsAwaitingAnalysis.length > 0;

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
    async (oilQuantityLiters: number, bufferTankId: number) => {
      if (!operation) return;

      await completeOperation({
        id: operation.id,
        oilQuantity: oilQuantityLiters,
        bufferTankId,
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
            subtitle={awaitsAnalysis ? "Analyse d'olive en attente" : "Commencer les opérations"}
            loading={saving}
            disabled={awaitsAnalysis}
            onPress={handleStart}
          />
        )}

        {isInProgress && (
          <ActionCard
            icon="✓"
            title="Clôturer le pressurage"
            subtitle={awaitsAnalysis ? "Analyse d'olive en attente" : "Enregistrer les résultats"}
            loading={saving}
            disabled={awaitsAnalysis}
            onPress={handleOpenCloseSheet}
          />
        )}

        {/* Lots qui bloquent : un appui ouvre leur analyse d'olive. */}
        {(isPlanned || isInProgress) && awaitsAnalysis && (
          <View style={styles.warning}>
            <Text style={[typography.caption, styles.warningText]}>
              {isPlanned
                ? "La pression ne peut pas être lancée"
                : "La pression ne peut pas être clôturée"}{" "}
              : {lotsAwaitingAnalysis.length > 1 ? "ces lots attendent" : "ce lot attend"} la
              fin de {lotsAwaitingAnalysis.length > 1 ? "leur" : "son"} analyse d&apos;olive.
            </Text>

            <View style={styles.warningLots}>
              {lotsAwaitingAnalysis.map((input) => (
                <Pressable
                  key={input.id}
                  style={styles.lotChip}
                  disabled={!input.analysis?.id}
                  onPress={() =>
                    input.analysis?.id &&
                    router.push({
                      pathname: "/analyses/[id]",
                      params: { id: String(input.analysis.id) },
                    })
                  }
                >
                  <Text style={[typography.caption, styles.lotChipText]}>
                    {input.lotReference}
                    {input.analysis?.id ? "  ›" : ""}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
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
  warning: {
    marginTop: -spacing.md,
    marginBottom: spacing.xl,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: semanticColors.warningSoft,
    gap: spacing.sm,
  },
  warningText: {
    color: semanticColors.warning,
  },
  warningLots: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  lotChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: semanticColors.surface,
    borderWidth: 1,
    borderColor: semanticColors.warning,
  },
  lotChipText: {
    color: semanticColors.warning,
    fontWeight: "700",
  },
  bottomSpace: {
    height: spacing.xxl,
  },
});