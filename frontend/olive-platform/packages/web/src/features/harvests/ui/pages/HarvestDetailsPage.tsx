import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../../../../common/widgets/button/Button";

import { useHarvestDetailsStore } from "@olive-platform/core/features/harvests/stores/HarvestDetailsStore";
import HarvestTabs, { type HarvestTab } from "../components/HarvestTabs";
import HarvestGeneralTab from "../components/HarvestGeneralTab";
import HarvestStocksTab from "../components/HarvestStockTab";
import CloseHarvestDrawer from "../components/CompleteHarvestDrawer";
import type { HarvestStockParams } from "@olive-platform/core/features/harvests/domain/params/HarvestStockParams";
import { toast } from "react-toastify";
import { usePageTitle } from "../../../../common/hooks/usePageTitle";
import { ProductionStatus } from "@olive-platform/core/features/production/domain/entities/ProductionStatus";
import { renderStatus } from "../../../../common/status/StatusUtils";
import { productionStatusConfig } from "../../../../common/status/ProductionStatusConfig";
import Drawer from "../../../../common/widgets/drawer/Drawer";
import {
  formatDate,
  getTodayDate,
  toDateOnlyString,
} from "@olive-platform/core/features/shared/utils/DatesUtils";
import { WeatherRepository } from "@olive-platform/core/features/weather/data/repositories/WeatherRepository";
import type {
  HarvestWeatherAdvice,
  WeatherAdviceLevel,
} from "@olive-platform/core/features/weather/domain/entities/WeatherForecast";
import { WeatherAdviceView } from "../components/HarvestWeatherAdvice";

// Alerte (warning) ou danger : le lancement demande une confirmation.
const isUnfavorable = (level: WeatherAdviceLevel) =>
  level === "warning" || level === "danger";

export default function HarvestDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [closeDrawerOpen, setCloseDrawerOpen] = useState(false);
  // Météo défavorable au lancement : le drawer de confirmation s'ouvre.
  const [startAdvice, setStartAdvice] = useState<HarvestWeatherAdvice | null>(null);
  const [checkingWeather, setCheckingWeather] = useState(false);
  const [activeTab, setActiveTab] =
    useState<HarvestTab>("general");
  
  const {
    harvest,
    saving,
    fetchHarvest,
    start,
    complete,
    clear,
  } = useHarvestDetailsStore();

  const harvestId = Number(id);

  const isPlanned =
    harvest?.status === ProductionStatus.Planned;

  const isInProgress =
    harvest?.status === ProductionStatus.InProgress;

  // Pas de lancement avant le jour prévu (règle vérifiée aussi par l'API).
  const startsLater =
    !!harvest?.plannedDate &&
    toDateOnlyString(new Date(harvest.plannedDate)) > getTodayDate();

     usePageTitle(
        `Récolte ${harvest?.reference}`,
        "Gestion des récoltes d'olives et suivi de leur qualité.",
      );

  useEffect(() => {
    if (!id) {
      return;
    }

    fetchHarvest(harvestId);
  }, [id, harvestId, fetchHarvest]);

  useEffect(() => {
    return () => {
      clear();
    };
  }, [clear]);

  const launchHarvest = async (weatherAcknowledged: boolean) => {
    if (!harvest) {
      return;
    }

    try {
      await start(harvest.id, weatherAcknowledged);
      setStartAdvice(null);
      toast.success("Opération lancée avec succés")
    } catch (e: any) {
      toast.error(e?.message ?? "Erreur de lancement de l'opération")
    }
  };

  // Météo du jour d'abord : si elle est défavorable, confirmation dans le drawer.
  const handleStartHarvest = async () => {
    if (!harvest) {
      return;
    }

    setCheckingWeather(true);

    const advice = await WeatherRepository.getHarvestStartCheck(harvest.id)
      // Météo indisponible : on ne bloque pas le lancement.
      .catch(() => null)
      .finally(() => setCheckingWeather(false));

    if (advice && isUnfavorable(advice.level)) {
      setStartAdvice(advice);
      return;
    }

    await launchHarvest(false);
  };

  const handleCloseHarvest = async (
    stocks: HarvestStockParams[],
    proceedAnalyse: boolean,
  ) => {
    if (!harvest) {
      return;
    }

    try {
      await complete(
        harvest.id,
        harvest.quantityKg ?? 0,
        harvest.harvestedTrees,
        new Date().toISOString(),
        stocks,
        proceedAnalyse,
      );

      setCloseDrawerOpen(false);
      await fetchHarvest(harvest.id);

      toast.success("Opération terminée avec succèes")
    } catch {
      toast.error("Nous n'avons pas clôturé l'opération")    
    }
  };

  return (
    <div className="feature-page">
      <div className="page-header">
        <div className="page-header-content">
          {harvest &&
            renderStatus(
              harvest.status,
              productionStatusConfig,
            )}
        </div>

        {isPlanned && (
          <Button
            variant="primary"
            onClick={handleStartHarvest}
            disabled={saving || checkingWeather || startsLater}
          >
            {startsLater
              ? `Lancement possible le ${formatDate(harvest!.plannedDate)}`
              : checkingWeather
              ? "Vérification météo..."
              : saving
                ? "Lancement..."
                : "Lancer la récolte"}
          </Button>
        )}

        {isInProgress && (
          <Button
            variant="primary"
            onClick={() => setCloseDrawerOpen(true)}
            disabled={saving}
          >
            Clôturer la récolte
          </Button>
        )}

        {/* Récolte terminée avec des lots à presser : ouvre « Nouvelle pression ». */}
        {harvest?.canBePressed && (
          <Button
            variant="primary"
            onClick={() => navigate(`/production/new?harvestId=${harvest.id}`)}
          >
            Lancer la pression
          </Button>
        )}
      </div>

      <HarvestTabs
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "general" && harvest && (
        <HarvestGeneralTab
          harvestId={harvest.id}
          onNotesChange={() => {}}
        />
      )}

      {activeTab === "olives" && harvest && (
        <HarvestStocksTab
          harvestId={harvest.id}
        />
      )}

      {harvest && (
        <CloseHarvestDrawer
          open={closeDrawerOpen}
          saving={saving}
          harvest={harvest}
          onClose={() => setCloseDrawerOpen(false)}
          onConfirm={handleCloseHarvest}
        />
      )}

      <Drawer
        open={startAdvice !== null}
        title="Météo défavorable"
        description="La météo du jour est enregistrée avec le lancement de la récolte."
        onClose={() => setStartAdvice(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setStartAdvice(null)} disabled={saving}>
              Annuler
            </Button>
            <Button variant="primary" onClick={() => launchHarvest(true)} disabled={saving}>
              {saving ? "Lancement..." : "Lancer quand même"}
            </Button>
          </>
        }
      >
        {startAdvice && <WeatherAdviceView advice={startAdvice} />}
      </Drawer>
    </div>
  );
}