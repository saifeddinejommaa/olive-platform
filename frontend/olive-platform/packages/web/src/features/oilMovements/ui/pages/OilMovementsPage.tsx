import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DataTable from "../../../../common/widgets/tables/OrdersTable";
import Button from "../../../../common/widgets/button/Button";
import Card from "../../../../common/widgets/card/Card";
import TextInput from "../../../../common/widgets/textInput/TextInput";
import Select from "../../../../common/widgets/select/Select";
import { usePageTitle } from "../../../../common/hooks/usePageTitle";
import { formatLiters } from "../../../tanks/ui/TankFormat";
import "../../../tanks/ui/Tanks.css";

import {
  OilMovementType,
  type OilMovement,
} from "@olive-platform/core/features/oilMovements/domain/entities/OilMovement";
import { GetOilMovements } from "@olive-platform/core/features/oilMovements/domain/usecases/OilMovementUseCases";
import type { Tank } from "@olive-platform/core/features/tanks/domain/entities/Tank";
import { GetTanks } from "@olive-platform/core/features/tanks/domain/usecases/GetTanks";

const PAGE_SIZE = 20;

const movementTypeOptions = [
  { value: String(OilMovementType.ProductionIn), label: "Entrée production" },
  { value: String(OilMovementType.Transfer), label: "Transfert" },
  { value: String(OilMovementType.SaleOut), label: "Sortie vente" },
  { value: String(OilMovementType.Adjustment), label: "Ajustement" },
];

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// Citerne d'un mouvement : code et nom, « - » pour une entrée ou une sortie.
function TankCell({ code, name }: { code: string | null; name: string | null }) {
  if (!code) return <span className="tank-cell__sub">-</span>;

  return (
    <div className="tank-cell">
      <strong>{code}</strong>
      {name && <span className="tank-cell__sub">{name}</span>}
    </div>
  );
}

type Filters = {
  search: string;
  movementType: string;
  tankId: string;
  fromDate: string;
  toDate: string;
};

const emptyFilters: Filters = {
  search: "",
  movementType: "",
  tankId: "",
  fromDate: "",
  toDate: "",
};

export default function OilMovementsPage() {
  const navigate = useNavigate();

  usePageTitle(
    "Mouvements d'huile",
    "Entrées de production, transferts entre citernes et sorties d'huile.",
  );

  const [movements, setMovements] = useState<OilMovement[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMovements = useCallback(
    async (pageNumber: number, current: Filters) => {
      setLoading(true);
      setError(null);

      try {
        const result = await GetOilMovements({
          search: current.search.trim() || undefined,
          movementType: current.movementType
            ? (Number(current.movementType) as OilMovementType)
            : undefined,
          tankId: current.tankId ? Number(current.tankId) : undefined,
          fromDate: current.fromDate || undefined,
          toDate: current.toDate || undefined,
          pageNumber,
          pageSize: PAGE_SIZE,
        });

        setMovements(result.items);
        setTotalCount(result.totalCount);
        setPage(pageNumber);
      } catch {
        setError("Impossible de charger les mouvements d'huile.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchMovements(1, emptyFilters);

    GetTanks()
      .then(setTanks)
      .catch(() => setTanks([]));
  }, [fetchMovements]);

  const updateFilter = (field: keyof Filters, value: string) =>
    setFilters((previous) => ({ ...previous, [field]: value }));

  const handleSearch = () => fetchMovements(1, filters);

  const handleReset = () => {
    setFilters(emptyFilters);
    fetchMovements(1, emptyFilters);
  };

  const tankOptions = tanks.map((tank) => ({
    value: String(tank.id),
    label: tank.name ? `${tank.code} · ${tank.name}` : tank.code,
  }));

  const columns = [
    {
      key: "movementDate" as keyof OilMovement,
      label: "Date",
      render: (movement: OilMovement) => (
        <span className="tank-nowrap">{formatDateTime(movement.movementDate)}</span>
      ),
    },
    {
      key: "movementNumber" as keyof OilMovement,
      label: "Mouvement",
      render: (movement: OilMovement) => (
        <div className="tank-cell">
          <strong>{movement.movementNumber}</strong>
          <span className="tank-cell__sub">{movement.movementTypeLabel ?? "-"}</span>
        </div>
      ),
    },
    {
      key: "oilBatchNumber" as keyof OilMovement,
      label: "Lot d'huile",
      render: (movement: OilMovement) => (
        <div className="tank-cell">
          <span>{movement.oilBatchNumber ?? "-"}</span>
          {movement.pressingNumber && (
            <span className="tank-cell__sub">{movement.pressingNumber}</span>
          )}
        </div>
      ),
    },
    {
      key: "sourceTankCode" as keyof OilMovement,
      label: "De",
      render: (movement: OilMovement) => (
        <TankCell code={movement.sourceTankCode} name={movement.sourceTankName} />
      ),
    },
    {
      key: "destinationTankCode" as keyof OilMovement,
      label: "Vers",
      render: (movement: OilMovement) => (
        <TankCell code={movement.destinationTankCode} name={movement.destinationTankName} />
      ),
    },
    {
      key: "quantityLiters" as keyof OilMovement,
      label: "Quantité",
      render: (movement: OilMovement) => (
        <strong className="tank-nowrap">{formatLiters(movement.quantityLiters)}</strong>
      ),
    },
  ];

  return (
    <div className="feature-page">
      <Card>
        <div className="filters">
          <div className="filters-header">
            <div>
              <h3 className="filter-title">Filtres de recherche</h3>
              <span className="filter-subtitle">Rechercher un mouvement d'huile</span>
            </div>
          </div>

          <div className="filters-content filters-content-row">
            <div className="filter-item">
              <TextInput
                label="Référence"
                placeholder="Mouvement, lot ou pression"
                value={filters.search}
                onChange={(event) => updateFilter("search", event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleSearch();
                }}
              />
            </div>

            <div className="filter-item">
              <Select
                label="Type"
                placeholder="Tous"
                options={movementTypeOptions}
                value={filters.movementType}
                onChange={(event) => updateFilter("movementType", event.target.value)}
              />
            </div>

            <div className="filter-item">
              <Select
                label="Citerne"
                placeholder="Toutes"
                options={tankOptions}
                value={filters.tankId}
                onChange={(event) => updateFilter("tankId", event.target.value)}
              />
            </div>

            <div className="filter-item">
              <TextInput
                label="Du"
                type="date"
                value={filters.fromDate}
                onChange={(event) => updateFilter("fromDate", event.target.value)}
              />
            </div>

            <div className="filter-item">
              <TextInput
                label="Au"
                type="date"
                value={filters.toDate}
                onChange={(event) => updateFilter("toDate", event.target.value)}
              />
            </div>
          </div>

          <div className="filters-footer">
            <Button variant="secondary" onClick={handleReset} disabled={loading}>
              Réinitialiser
            </Button>
            <Button variant="primary" onClick={handleSearch} disabled={loading}>
              Rechercher
            </Button>
          </div>
        </div>
      </Card>

      {error && <div className="error-message">{error}</div>}

      <DataTable
        data={movements}
        columns={columns}
        onRowClick={(movement: OilMovement) => {
          const tankId = movement.destinationTankId ?? movement.sourceTankId;
          if (tankId) navigate(`/tanks/${tankId}`);
        }}
        pageNumber={page}
        pageSize={PAGE_SIZE}
        totalCount={totalCount}
        onPageChange={(pageNumber: number) => fetchMovements(pageNumber, filters)}
      />

      {loading && <div className="loading">Chargement des mouvements...</div>}
    </div>
  );
}
