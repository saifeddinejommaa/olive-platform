import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DataTable from "../../../../common/widgets/tables/OrdersTable";
import Card from "../../../../common/widgets/card/Card";
import Select from "../../../../common/widgets/select/Select";
import OilCategoryBadge from "../../../../common/widgets/oilCategoryBadge/OilCategoryBadge";
import { usePageTitle } from "../../../../common/hooks/usePageTitle";
import TankGauge from "../components/TankGauge";
import { formatLiters } from "../TankFormat";
import TransferOilDrawer from "../components/TransferOilDrawer";
import ActionCard from "../../../../common/widgets/actionCard/ActionCard";

import {
  OIL_CATEGORY_LABELS,
  OilCategory,
  TankType,
  type Tank,
} from "@olive-platform/core/features/tanks/domain/entities/Tank";
import { GetTanks } from "@olive-platform/core/features/tanks/domain/usecases/GetTanks";
import { bufferOilState, tankCategory } from "@olive-platform/core/features/tanks/domain/OilType";

const PAGE_SIZE = 10;

const tankTypeOptions = [
  { value: String(TankType.Buffer), label: "Tampon" },
  { value: String(TankType.Storage), label: "Stockage" },
];

const oilCategoryOptions = [
  { value: String(OilCategory.ExtraVirgin), label: "Extra vierge" },
  { value: String(OilCategory.Virgin), label: "Vierge" },
  { value: String(OilCategory.Lampante), label: "Lampante" },
  { value: String(OilCategory.PendingAnalysis), label: "En citerne tampon" },
];

// Stock d'huile par catégorie (les tampons contiennent l'huile en attente d'analyse).
const stockCategories: { category: OilCategory; label: string }[] = [
  { category: OilCategory.ExtraVirgin, label: "Extra vierge" },
  { category: OilCategory.Virgin, label: "Vierge" },
  { category: OilCategory.Lampante, label: "Lampante" },
  { category: OilCategory.PendingAnalysis, label: "En citerne tampon" },
];

// Huile d'une citerne : catégorie du stockage ; en tampon, l'état de son analyse.
function TankOilBadge({ tank }: { tank: Tank }) {
  if (tank.tankType !== TankType.Buffer) {
    return <OilCategoryBadge category={tankCategory(tank)} />;
  }

  const state = bufferOilState(tank);

  if (state.kind === "empty") return <span className="tank-cell__sub">Libre</span>;

  if (state.kind === "analysed") {
    return (
      <OilCategoryBadge category={state.category}>
        {state.category ? `${OIL_CATEGORY_LABELS[state.category]} · à transférer` : "Analysée · à transférer"}
      </OilCategoryBadge>
    );
  }

  return <OilCategoryBadge category={null}>{state.label}</OilCategoryBadge>;
}

export default function TanksPage() {
  const navigate = useNavigate();

  usePageTitle("Citernes", "Citernes tampon et de stockage, avec l'huile qu'elles contiennent.");

  const [tanks, setTanks] = useState<Tank[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [tankType, setTankType] = useState("");
  const [oilCategory, setOilCategory] = useState("");
  // Citerne dont on transfère l'huile (tiroir ouvert).
  const [transferTank, setTransferTank] = useState<Tank | null>(null);

  const fetchTanks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setTanks(
        await GetTanks({
          tankType: tankType ? (Number(tankType) as TankType) : undefined,
          oilCategory: oilCategory ? (Number(oilCategory) as OilCategory) : undefined,
        }),
      );
      setPage(1);
    } catch {
      setError("Impossible de charger les citernes.");
    } finally {
      setLoading(false);
    }
  }, [tankType, oilCategory]);

  useEffect(() => {
    fetchTanks();
  }, [fetchTanks]);

  const pageItems = tanks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Transfert possible seulement s'il y a une destination :
  // - tampon : huile analysée (elle part vers le stockage de sa catégorie) ;
  // - stockage : une autre citerne active de la même catégorie existe.
  const canTransfer = (tank: Tank) => {
    if (Number(tank.currentQuantityLiters) <= 0) return false;

    if (tank.tankType === TankType.Buffer) {
      return bufferOilState(tank).kind === "analysed";
    }

    return tanks.some(
      (other) =>
        other.id !== tank.id &&
        other.tankType === TankType.Storage &&
        other.status === "active" &&
        other.oilCategory === tank.oilCategory,
    );
  };

  const litersOf = (items: Tank[]) =>
    items.reduce((total, tank) => total + Number(tank.currentQuantityLiters), 0);

  const stockOf = (category: OilCategory) =>
    litersOf(tanks.filter((tank) => tank.oilCategory === category));

  // Huile en tampon déjà analysée : elle n'attend plus que son transfert.
  const analysedBufferLiters = litersOf(
    tanks.filter(
      (tank) =>
        tank.tankType === TankType.Buffer && bufferOilState(tank).kind === "analysed",
    ),
  );
  const awaitingAnalysisLiters = stockOf(OilCategory.PendingAnalysis) - analysedBufferLiters;

  const columns = [
    {
      key: "code" as keyof Tank,
      label: "Citerne",
      render: (tank: Tank) => (
        <div className="tank-cell">
          <strong>{tank.code}</strong>
          {tank.name && <span className="tank-cell__sub">{tank.name}</span>}
        </div>
      ),
    },
    {
      key: "tankTypeLabel" as keyof Tank,
      label: "Type",
      render: (tank: Tank) => tank.tankTypeLabel,
    },
    {
      key: "oilCategory" as keyof Tank,
      label: "Huile",
      render: (tank: Tank) => (
        <div className="tank-cell">
          <TankOilBadge tank={tank} />
          {tank.pendingPressingNumber && (
            <span className="tank-cell__sub">{tank.pendingPressingNumber}</span>
          )}
        </div>
      ),
    },
    {
      key: "currentQuantityLiters" as keyof Tank,
      label: "Contenu",
      render: (tank: Tank) => <TankGauge tank={tank} />,
    },
    {
      key: "availableCapacityLiters" as keyof Tank,
      label: "Place libre",
      render: (tank: Tank) => (
        <span className="tank-nowrap">{formatLiters(tank.availableCapacityLiters)}</span>
      ),
    },
    {
      key: "id" as keyof Tank,
      label: "Actions",
      render: (tank: Tank) => (
        <div style={{ display: "flex", gap: "4px", justifyContent: "flex-end" }}>
          {canTransfer(tank) && (
            <ActionCard
              type="move"
              title="Transférer l'huile"
              onClick={() => setTransferTank(tank)}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="feature-page">
      <div className="tank-stock-summary">
        {stockCategories.map(({ category, label }) => (
          <Card key={category}>
            <div className="tank-stock-summary__item">
              <OilCategoryBadge category={category === OilCategory.PendingAnalysis ? null : category}>
                {label}
              </OilCategoryBadge>
              <span className="tank-stock-summary__value">
                {formatLiters(stockOf(category))}
              </span>
              {category === OilCategory.PendingAnalysis && stockOf(category) > 0 && (
                <span className="tank-cell__sub">
                  {[
                    awaitingAnalysisLiters > 0 &&
                      `${formatLiters(awaitingAnalysisLiters)} en attente d'analyse`,
                    analysedBufferLiters > 0 &&
                      `${formatLiters(analysedBufferLiters)} analysés, à transférer`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="filters">
          <div className="filters-header">
            <div>
              <h3 className="filter-title">Filtres de recherche</h3>
              <span className="filter-subtitle">Rechercher une citerne</span>
            </div>
          </div>

          <div className="filters-content filters-content-row">
            <div className="filter-item">
              <Select
                label="Type"
                placeholder="Tous"
                options={tankTypeOptions}
                value={tankType}
                onChange={(event) => setTankType(event.target.value)}
              />
            </div>

            <div className="filter-item">
              <Select
                label="Catégorie d'huile"
                placeholder="Toutes"
                options={oilCategoryOptions}
                value={oilCategory}
                onChange={(event) => setOilCategory(event.target.value)}
              />
            </div>
          </div>
        </div>
      </Card>

      {error && <div className="error-message">{error}</div>}

      <DataTable
        data={pageItems}
        columns={columns}
        onRowClick={(tank: Tank) => navigate(`/tanks/${tank.id}`)}
        pageNumber={page}
        pageSize={PAGE_SIZE}
        totalCount={tanks.length}
        onPageChange={setPage}
      />

      {loading && <div className="loading">Chargement des citernes...</div>}

      <TransferOilDrawer
        tank={transferTank}
        onClose={() => setTransferTank(null)}
        onTransferred={fetchTanks}
      />
    </div>
  );
}
