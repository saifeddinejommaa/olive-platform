import { useCallback, useEffect, useState } from "react";

import Button from "../../../../common/widgets/button/Button";
import Card from "../../../../common/widgets/card/Card";
import DataTable from "../../../../common/widgets/tables/OrdersTable";
import TextInput from "../../../../common/widgets/textInput/TextInput";
import { usePageTitle } from "../../../../common/hooks/usePageTitle";
import CustomerDrawer from "../components/CustomerDrawer";
import { formatAmount, formatQuantity } from "../../../oilSales/ui/OilSaleFormat";
import "../../../tanks/ui/Tanks.css";

import type { Customer } from "@olive-platform/core/features/customers/domain/entities/Customer";
import { CustomerRepository } from "@olive-platform/core/features/customers/data/repositories/CustomerRepository";

const PAGE_SIZE = 20;

export default function CustomersPage() {
  usePageTitle("Clients", "Acheteurs de l'huile vendue en vrac.");

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tiroir de modification : undefined = fermé. Les clients se créent depuis une vente.
  const [editing, setEditing] = useState<Customer | null | undefined>(undefined);

  const fetchCustomers = useCallback(async (value: string) => {
    setLoading(true);
    setError(null);

    try {
      setCustomers(await CustomerRepository.getCustomers({ search: value.trim() || undefined }));
      setPage(1);
    } catch {
      setError("Impossible de charger les clients.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers("");
  }, [fetchCustomers]);

  const columns = [
    {
      key: "name" as keyof Customer,
      label: "Client",
      render: (customer: Customer) => (
        <div className="tank-cell">
          <strong>{customer.name}</strong>
          <span className="tank-cell__sub">
            {customer.reference}
            {!customer.isActive && " · inactif"}
          </span>
        </div>
      ),
    },
    {
      key: "phone" as keyof Customer,
      label: "Téléphone",
      render: (customer: Customer) => customer.phone ?? "-",
    },
    {
      key: "taxId" as keyof Customer,
      label: "Matricule fiscal",
      render: (customer: Customer) => customer.taxId ?? "-",
    },
    {
      key: "salesCount" as keyof Customer,
      label: "Ventes livrées",
      render: (customer: Customer) => (
        <div className="tank-cell">
          <span>{customer.salesCount}</span>
          {customer.salesCount > 0 && (
            <span className="tank-cell__sub">{formatQuantity(customer.soldLiters, "L")}</span>
          )}
        </div>
      ),
    },
    {
      key: "salesAmount" as keyof Customer,
      label: "Chiffre d'affaires",
      render: (customer: Customer) => (
        <strong className="tank-nowrap">{formatAmount(customer.salesAmount)}</strong>
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
              <span className="filter-subtitle">Rechercher un client</span>
            </div>
          </div>

          <div className="filters-content filters-content-row">
            <div className="filter-item">
              <TextInput
                label="Recherche"
                placeholder="Nom, référence, téléphone, matricule"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") fetchCustomers(search);
                }}
              />
            </div>
          </div>

          <div className="filters-footer">
            <Button
              variant="secondary"
              onClick={() => {
                setSearch("");
                fetchCustomers("");
              }}
              disabled={loading}
            >
              Réinitialiser
            </Button>
            <Button variant="primary" onClick={() => fetchCustomers(search)} disabled={loading}>
              Rechercher
            </Button>
          </div>
        </div>
      </Card>

      {error && <div className="error-message">{error}</div>}

      <DataTable
        data={customers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)}
        columns={columns}
        onRowClick={(customer: Customer) => setEditing(customer)}
        pageNumber={page}
        pageSize={PAGE_SIZE}
        totalCount={customers.length}
        onPageChange={setPage}
      />

      {loading && <div className="loading">Chargement des clients...</div>}

      <CustomerDrawer
        open={editing !== undefined}
        customer={editing ?? null}
        onClose={() => setEditing(undefined)}
        onSaved={() => fetchCustomers(search)}
      />
    </div>
  );
}
