import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconPlus } from "@tabler/icons-react";

import Button from "../../../../common/widgets/button/Button";
import Card from "../../../../common/widgets/card/Card";
import DataTable from "../../../../common/widgets/tables/OrdersTable";
import Select from "../../../../common/widgets/select/Select";
import TextInput from "../../../../common/widgets/textInput/TextInput";
import { usePageTitle } from "../../../../common/hooks/usePageTitle";
import { renderStatus } from "../../../../common/status/StatusUtils";
import { oilSaleStatusConfig } from "../../../../common/status/OilSaleStatusConfig";
import { formatAmount, formatQuantity, formatSaleDate } from "../OilSaleFormat";
import "../../../tanks/ui/Tanks.css";

import {
  OilSaleStatus,
  type OilSaleForList,
} from "@olive-platform/core/features/oilSales/domain/entities/OilSale";
import { OilSaleRepository } from "@olive-platform/core/features/oilSales/data/repositories/OilSaleRepository";

const PAGE_SIZE = 20;

const statusOptions = [
  { value: String(OilSaleStatus.Draft), label: "Brouillon" },
  { value: String(OilSaleStatus.Delivered), label: "Livrée" },
  { value: String(OilSaleStatus.Cancelled), label: "Annulée" },
];

type Filters = {
  search: string;
  status: string;
  fromDate: string;
  toDate: string;
};

const emptyFilters: Filters = { search: "", status: "", fromDate: "", toDate: "" };

export default function OilSalesPage() {
  const navigate = useNavigate();

  usePageTitle("Ventes d'huile", "Ventes d'huile en vrac : sortie des citernes et chiffre d'affaires.");

  const [sales, setSales] = useState<OilSaleForList[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = useCallback(async (pageNumber: number, current: Filters) => {
    setLoading(true);
    setError(null);

    try {
      const result = await OilSaleRepository.getSales({
        search: current.search.trim() || undefined,
        status: current.status ? (Number(current.status) as OilSaleStatus) : undefined,
        fromDate: current.fromDate || undefined,
        toDate: current.toDate || undefined,
        pageNumber,
        pageSize: PAGE_SIZE,
      });

      setSales(result.items);
      setTotalCount(result.totalCount);
      setPage(pageNumber);
    } catch {
      setError("Impossible de charger les ventes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales(1, emptyFilters);
  }, [fetchSales]);

  const updateFilter = (field: keyof Filters, value: string) =>
    setFilters((previous) => ({ ...previous, [field]: value }));

  const columns = [
    {
      key: "reference" as keyof OilSaleForList,
      label: "Vente",
      render: (sale: OilSaleForList) => (
        <div className="tank-cell">
          <strong>{sale.reference}</strong>
          <span className="tank-cell__sub">{formatSaleDate(sale.saleDate)}</span>
        </div>
      ),
    },
    {
      key: "customerName" as keyof OilSaleForList,
      label: "Client",
      render: (sale: OilSaleForList) => sale.customerName,
    },
    {
      key: "tanks" as keyof OilSaleForList,
      label: "Citernes",
      render: (sale: OilSaleForList) => sale.tanks ?? "-",
    },
    {
      key: "quantityLiters" as keyof OilSaleForList,
      label: "Quantité",
      render: (sale: OilSaleForList) => (
        <div className="tank-cell">
          <span className="tank-nowrap">{formatQuantity(sale.quantityLiters, "L")}</span>
          {sale.quantityKg !== null && (
            <span className="tank-cell__sub tank-nowrap">{formatQuantity(sale.quantityKg, "kg")}</span>
          )}
        </div>
      ),
    },
    {
      key: "totalAmount" as keyof OilSaleForList,
      label: "Montant TTC",
      render: (sale: OilSaleForList) => (
        <strong className="tank-nowrap">{formatAmount(sale.totalAmount)}</strong>
      ),
    },
    {
      key: "remainingAmount" as keyof OilSaleForList,
      label: "Reste à payer",
      // Seulement pour une vente livrée : le client doit la payer.
      render: (sale: OilSaleForList) =>
        sale.status === OilSaleStatus.Delivered ? (
          <span
            className="tank-nowrap"
            style={{
              fontWeight: 600,
              color:
                Number(sale.remainingAmount) > 0
                  ? "var(--color-rust-600)"
                  : "var(--color-olive-700)",
            }}
          >
            {Number(sale.remainingAmount) > 0 ? formatAmount(sale.remainingAmount) : "Payée"}
          </span>
        ) : (
          "-"
        ),
    },
    {
      key: "status" as keyof OilSaleForList,
      label: "Statut",
      render: (sale: OilSaleForList) => renderStatus(sale.status, oilSaleStatusConfig),
    },
  ];

  return (
    <div className="feature-page">
      <div className="page-header page-header-actions">
        <Button variant="primary" onClick={() => navigate("/oil-sales/new")}>
          <IconPlus size={18} stroke={2} />
          Nouvelle vente
        </Button>
      </div>

      <Card>
        <div className="filters">
          <div className="filters-header">
            <div>
              <h3 className="filter-title">Filtres de recherche</h3>
              <span className="filter-subtitle">Rechercher une vente</span>
            </div>
          </div>

          <div className="filters-content filters-content-row">
            <div className="filter-item">
              <TextInput
                label="Référence"
                placeholder="Vente ou client"
                value={filters.search}
                onChange={(event) => updateFilter("search", event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") fetchSales(1, filters);
                }}
              />
            </div>

            <div className="filter-item">
              <Select
                label="Statut"
                placeholder="Tous"
                options={statusOptions}
                value={filters.status}
                onChange={(event) => updateFilter("status", event.target.value)}
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
            <Button
              variant="secondary"
              onClick={() => {
                setFilters(emptyFilters);
                fetchSales(1, emptyFilters);
              }}
              disabled={loading}
            >
              Réinitialiser
            </Button>
            <Button variant="primary" onClick={() => fetchSales(1, filters)} disabled={loading}>
              Rechercher
            </Button>
          </div>
        </div>
      </Card>

      {error && <div className="error-message">{error}</div>}

      <DataTable
        data={sales}
        columns={columns}
        onRowClick={(sale: OilSaleForList) => navigate(`/oil-sales/${sale.id}`)}
        pageNumber={page}
        pageSize={PAGE_SIZE}
        totalCount={totalCount}
        onPageChange={(pageNumber: number) => fetchSales(pageNumber, filters)}
      />

      {loading && <div className="loading">Chargement des ventes...</div>}
    </div>
  );
}
