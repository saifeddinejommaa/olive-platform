import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DataTable from "../../../../common/widgets/tables/OrdersTable";
import ActionCard from "../../../../common/widgets/actionCard/ActionCard";
import { usePageTitle } from "../../../../common/hooks/usePageTitle";
import { renderStatus } from "../../../../common/status/StatusUtils";
import { productionStatusConfig } from "../../../../common/status/ProductionStatusConfig";
import { oliveLotPressStatusConfig } from "../../../../common/status/OliveLotPressStatusConfig";
import OliveLotsFilterComponent from "../components/OliveLotsFilterComponent";

import { useOliveLotsStore } from "@olive-platform/core/features/oliveLots/stores/OliveLotsStore";
import type { OliveLot } from "@olive-platform/core/features/oliveLots/domain/entities/OliveLot";
import type { HarvestStockStatus } from "@olive-platform/core/features/harvests/domain/entities/HarvestStockStatus";
import { ProductionStatus } from "@olive-platform/core/features/production/domain/entities/ProductionStatus";

const PAGE_SIZE = 10;
const DAY_MS = 24 * 60 * 60 * 1000;

const formatKg = (value: number) =>
  `${value.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} kg`;

// Lot encore à presser : du restant, statut Disponible / Partiellement pressé.
const isToPress = (lot: OliveLot) =>
  lot.remainingKg > 0 && (lot.status === 1 || lot.status === 2);

// Analyse obligatoire et pas encore terminée : le lot ne se presse pas encore.
const awaitsAnalysis = (lot: OliveLot) =>
  lot.needAnalysis && lot.analysisStatus !== ProductionStatus.Completed;

// Ancienneté d'un lot à presser : l'olive perd en qualité après 24 à 48 h.
function ageTone(days: number) {
  if (days < 2) return "var(--color-olive-700)";
  if (days < 4) return "var(--color-gold-700)";
  return "var(--color-rust-600)";
}

// Nombre de jours calendaires écoulés (hier = 1, même si moins de 24 h).
function calendarDaysSince(date: Date) {
  const startOfDay = (value: Date) =>
    new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();

  return Math.round((startOfDay(new Date()) - startOfDay(date)) / DAY_MS);
}

function AvailableSince({ lot }: { lot: OliveLot }) {
  const created = new Date(lot.createdAt);
  const days = calendarDaysSince(created);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span>{created.toLocaleDateString("fr-FR")}</span>

      {isToPress(lot) && (
        <span style={{ fontSize: "var(--fs-xs)", fontWeight: 600, color: ageTone(days) }}>
          {days <= 0 ? "Aujourd'hui" : days === 1 ? "Depuis hier" : `Depuis ${days} j`}
        </span>
      )}
    </div>
  );
}

export default function OliveLotsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  usePageTitle(
    "Stock d'olives",
    "Lots d'olives de la campagne : disponibilité, analyse et pression.",
  );

  const { lots, loading, error, fetchLots } = useOliveLotsStore();

  useEffect(() => {
    fetchLots();
  }, [fetchLots]);

  // Nouvelle recherche : retour en première page.
  useEffect(() => {
    setPage(1);
  }, [lots]);

  const pageItems = lots.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Le clic sur une ligne ouvre la récolte ou l'achat d'origine.
  const handleOpenSource = (lot: OliveLot) => {
    if (lot.sourceType === 1 && lot.harvestId) {
      navigate(`/harvests/harvest-operation/${lot.harvestId}`);
    } else if (lot.purchaseId) {
      navigate(`/olive-purchases/${lot.purchaseId}`);
    }
  };

  // Nouvelle pression avec la source du lot présélectionnée.
  const handleLaunchPressing = (lot: OliveLot) => {
    navigate(
      lot.sourceType === 1
        ? `/production/new?harvestId=${lot.harvestId}`
        : `/production/new?purchaseId=${lot.purchaseId}`,
    );
  };

  const columns = [
    {
      key: "reference" as keyof OliveLot,
      label: "Lot",
      render: (lot: OliveLot) => <strong>{lot.reference}</strong>,
    },
    {
      key: "sourceReference" as keyof OliveLot,
      label: "Récolte / Achat",
      render: (lot: OliveLot) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span>{lot.sourceReference ?? "-"}</span>
          <span style={{ fontSize: "var(--fs-xs)", color: "var(--color-muted)" }}>
            {lot.sourceType === 1 ? "Récolte" : "Achat"}
          </span>
        </div>
      ),
    },
    {
      key: "remainingKg" as keyof OliveLot,
      label: "Quantité",
      // Quantité restante à presser ; le lot vidé indique ce qui est parti en pression.
      render: (lot: OliveLot) => {
        if (lot.remainingKg >= lot.quantityKg) return formatKg(lot.quantityKg);

        const pressedKg = lot.quantityKg - lot.remainingKg;

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span>
              {lot.remainingKg > 0
                ? `${formatKg(lot.remainingKg)} restants`
                : formatKg(lot.quantityKg)}
            </span>
            <span style={{ fontSize: "var(--fs-xs)", color: "var(--color-muted)" }}>
              {lot.remainingKg > 0
                ? `${formatKg(pressedKg)} pressés sur ${formatKg(lot.quantityKg)}`
                : lot.status === 3
                  ? "en cours de pression"
                  : "entièrement pressé"}
            </span>
          </div>
        );
      },
    },
    {
      key: "analysisStatus" as keyof OliveLot,
      label: "Analyse",
      // Analyse prévue : son statut ; sinon « - ».
      render: (lot: OliveLot) =>
        lot.analysisStatus != null
          ? renderStatus(lot.analysisStatus as ProductionStatus, productionStatusConfig)
          : "-",
    },
    {
      key: "status" as keyof OliveLot,
      label: "État",
      render: (lot: OliveLot) =>
        renderStatus(lot.status as HarvestStockStatus, oliveLotPressStatusConfig),
    },
    {
      key: "createdAt" as keyof OliveLot,
      label: "Disponible depuis",
      render: (lot: OliveLot) => <AvailableSince lot={lot} />,
    },
    {
      key: "id" as keyof OliveLot,
      label: "Actions",
      render: (lot: OliveLot) => (
        <div style={{ display: "flex", gap: "4px" }}>
          {awaitsAnalysis(lot) && lot.oliveAnalysisId && (
            <ActionCard
              type="analysis"
              title={`Ouvrir l'analyse ${lot.oliveAnalysisReference ?? ""}`}
              onClick={() => navigate(`/Olive-analyses/${lot.oliveAnalysisId}`)}
            />
          )}

          {isToPress(lot) && !awaitsAnalysis(lot) && (
            <ActionCard
              type="press"
              title="Lancer la pression"
              onClick={() => handleLaunchPressing(lot)}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="feature-page">
      <OliveLotsFilterComponent />

      {error && <div className="error-message">{error}</div>}

      <DataTable
        data={pageItems}
        columns={columns}
        onRowClick={handleOpenSource}
        pageNumber={page}
        pageSize={PAGE_SIZE}
        totalCount={lots.length}
        onPageChange={setPage}
      />

      {loading && <div className="loading">Chargement du stock d'olives...</div>}
    </div>
  );
}
