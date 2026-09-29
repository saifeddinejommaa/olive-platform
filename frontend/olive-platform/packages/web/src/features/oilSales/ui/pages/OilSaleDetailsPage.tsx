import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { IconBan, IconEdit, IconTruckDelivery } from "@tabler/icons-react";

import Button from "../../../../common/widgets/button/Button";
import Card from "../../../../common/widgets/card/Card";
import DataTable from "../../../../common/widgets/tables/OrdersTable";
import InfoFieldWidget from "../../../../common/widgets/InfoFieldWidget";
import { usePageTitle } from "../../../../common/hooks/usePageTitle";
import { renderStatus } from "../../../../common/status/StatusUtils";
import { oilSaleStatusConfig } from "../../../../common/status/OilSaleStatusConfig";
import { formatAmount, formatQuantity, formatSaleDate } from "../OilSaleFormat";
import DeliverOilSaleDrawer from "../components/DeliverOilSaleDrawer";
import "../../../tanks/ui/Tanks.css";

import {
  OilSaleStatus,
  type OilSaleDetails,
  type DeliveryPaymentParams,
  type OilSaleLine,
  type OilSalePayment,
} from "@olive-platform/core/features/oilSales/domain/entities/OilSale";
import { OilSaleRepository } from "@olive-platform/core/features/oilSales/data/repositories/OilSaleRepository";
import { formatStringToDateTime } from "@olive-platform/core/features/shared/utils/DatesUtils";

export default function OilSaleDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [sale, setSale] = useState<OilSaleDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deliverDrawerOpen, setDeliverDrawerOpen] = useState(false);

  usePageTitle(
    sale ? `Vente ${sale.reference}` : "Vente d'huile",
    "Vente d'huile en vrac : livraison et montants.",
  );

  const fetchSale = useCallback(async () => {
    const saleId = Number(id);

    if (!id || Number.isNaN(saleId)) {
      setError("Identifiant de vente invalide.");
      return;
    }

    setLoading(true);

    try {
      setSale(await OilSaleRepository.getById(saleId));
      setError(null);
    } catch {
      setError("Impossible de charger la vente.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSale();
  }, [fetchSale]);

  // Livraison : l'huile sort des citernes (irréversible), après validation dans le tiroir.
  const handleDeliver = async (payment?: DeliveryPaymentParams) => {
    if (!sale || saving) return;

    setSaving(true);

    try {
      await OilSaleRepository.deliver(sale.id, payment);
      toast.success(
        payment
          ? `Vente ${sale.reference} livrée, ${formatAmount(payment.amount)} encaissés.`
          : `Vente ${sale.reference} livrée : l'huile est sortie des citernes.`,
      );
      setDeliverDrawerOpen(false);
      await fetchSale();
    } catch (err) {
      toast.error(err instanceof Error && err.message ? err.message : "Impossible de livrer la vente.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!sale || saving) return;

    if (!window.confirm(`Annuler la vente ${sale.reference} ?`)) return;

    setSaving(true);

    try {
      await OilSaleRepository.cancel(sale.id);
      toast.success(`Vente ${sale.reference} annulée.`);
      await fetchSale();
    } catch (err) {
      toast.error(err instanceof Error && err.message ? err.message : "Impossible d'annuler la vente.");
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return (
      <div className="feature-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="feature-page">
        {loading && <div className="loading">Chargement de la vente...</div>}
      </div>
    );
  }

  const isDraft = sale.status === OilSaleStatus.Draft;

  const paymentColumns = [
    {
      key: "paymentDate" as keyof OilSalePayment,
      label: "Date",
      render: (payment: OilSalePayment) => formatSaleDate(payment.paymentDate),
    },
    {
      key: "paymentMethodLabel" as keyof OilSalePayment,
      label: "Mode",
      render: (payment: OilSalePayment) => payment.paymentMethodLabel,
    },
    {
      key: "reference" as keyof OilSalePayment,
      label: "Référence",
      render: (payment: OilSalePayment) => payment.reference ?? "-",
    },
    {
      key: "amount" as keyof OilSalePayment,
      label: "Montant",
      render: (payment: OilSalePayment) => (
        <strong className="tank-nowrap">{formatAmount(payment.amount)}</strong>
      ),
    },
  ];

  const lineColumns = [
    {
      key: "tankCode" as keyof OilSaleLine,
      label: "Citerne",
      render: (line: OilSaleLine) => (
        <div className="tank-cell">
          <strong>{line.tankCode}</strong>
          <span className="tank-cell__sub">{line.oilCategoryLabel}</span>
        </div>
      ),
    },
    {
      key: "quantityLiters" as keyof OilSaleLine,
      label: "Quantité",
      render: (line: OilSaleLine) => (
        <div className="tank-cell">
          <span className="tank-nowrap">{formatQuantity(line.quantityLiters, "L")}</span>
          {line.quantityKg !== null && (
            <span className="tank-cell__sub tank-nowrap">{formatQuantity(line.quantityKg, "kg")}</span>
          )}
        </div>
      ),
    },
    {
      key: "unitPrice" as keyof OilSaleLine,
      label: "Prix HT",
      render: (line: OilSaleLine) => (
        <span className="tank-nowrap">
          {formatAmount(line.unitPrice)} / {line.priceUnit}
        </span>
      ),
    },
    {
      key: "amount" as keyof OilSaleLine,
      label: "Montant HT",
      render: (line: OilSaleLine) => <strong className="tank-nowrap">{formatAmount(line.amount)}</strong>,
    },
    {
      key: "movementNumbers" as keyof OilSaleLine,
      label: "Sortie de citerne",
      render: (line: OilSaleLine) => line.movementNumbers ?? (isDraft ? "À la livraison" : "-"),
    },
  ];

  return (
    <div className="feature-page">
      {/* ==================== STATUT ET ACTIONS ==================== */}
      <div className="page-header">
        <div className="page-header-content">{renderStatus(sale.status, oilSaleStatusConfig)}</div>

        {isDraft && (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Button variant="secondary" onClick={handleCancel} disabled={saving}>
              <IconBan size={16} />
              Annuler la vente
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate(`/oil-sales/${sale.id}/edit`)}
              disabled={saving}
            >
              <IconEdit size={16} />
              Modifier
            </Button>
            <Button variant="primary" onClick={() => setDeliverDrawerOpen(true)} disabled={saving}>
              <IconTruckDelivery size={16} />
              Livrer (sortie des citernes)
            </Button>
          </div>
        )}
      </div>

      {/* ==================== INFORMATIONS ==================== */}
      <Card>
        <div className="filters">
          <div className="filters-header">
            <div>
              <h3>Informations générales</h3>
              <span>Client et dates de la vente.</span>
            </div>
          </div>

          <div className="info-grid">
            <InfoFieldWidget label="Client" value={`${sale.customerName} — ${sale.customerReference}`} />
            <InfoFieldWidget label="Téléphone" value={sale.customerPhone ?? "-"} />
            <InfoFieldWidget label="Matricule fiscal" value={sale.customerTaxId ?? "-"} />
            <InfoFieldWidget label="Date de vente" value={formatSaleDate(sale.saleDate)} />
            <InfoFieldWidget label="Livrée le" value={formatStringToDateTime(sale.deliveredAt)} />
            <InfoFieldWidget label="Quantité" value={formatQuantity(sale.quantityLiters, "L")} />
            {sale.notes && <InfoFieldWidget label="Notes" value={sale.notes} fullWidth />}
          </div>
        </div>
      </Card>

      {/* ==================== HUILE VENDUE ==================== */}
      <Card>
        <div className="filters">
          <div className="filters-header">
            <div>
              <h3>Huile vendue</h3>
              <span>
                {isDraft
                  ? "Brouillon : l'huile est encore dans les citernes jusqu'à la livraison."
                  : "Quantités sorties des citernes."}
              </span>
            </div>
          </div>

          <DataTable
            data={sale.lines}
            columns={lineColumns}
            onRowClick={(line: OilSaleLine) => navigate(`/tanks/${line.tankId}`)}
            pageNumber={1}
            pageSize={Math.max(sale.lines.length, 1)}
            totalCount={sale.lines.length}
            onPageChange={() => {}}
          />

          <div className="sale-totals">
            <span>Total HT</span>
            <strong>{formatAmount(sale.subtotal)}</strong>
            <span>TVA ({Number(sale.taxRate).toLocaleString("fr-FR")} %)</span>
            <strong>{formatAmount(sale.taxAmount)}</strong>
            <span className="sale-totals__grand">Total TTC</span>
            <strong className="sale-totals__grand">{formatAmount(sale.totalAmount)}</strong>
          </div>
        </div>
      </Card>

      {/* ==================== ENCAISSEMENTS ==================== */}
      {!isDraft && sale.status !== OilSaleStatus.Cancelled && (
        <Card>
          <div className="filters">
            <div className="filters-header">
              <div>
                <h3>Encaissements</h3>
                <span>Argent reçu du client pour cette vente.</span>
              </div>
            </div>

            <div className="info-grid">
              <InfoFieldWidget label="Total TTC" value={formatAmount(sale.totalAmount)} />
              <InfoFieldWidget label="Encaissé" value={formatAmount(sale.paidAmount)} />
              <InfoFieldWidget label="Reste à payer" value={formatAmount(sale.remainingAmount)} />
            </div>

            {sale.payments.length === 0 ? (
              <span className="tank-cell__sub">Aucun encaissement pour cette vente.</span>
            ) : (
              <DataTable
                data={sale.payments}
                columns={paymentColumns}
                pageNumber={1}
                pageSize={Math.max(sale.payments.length, 1)}
                totalCount={sale.payments.length}
                onPageChange={() => {}}
              />
            )}
          </div>
        </Card>
      )}

      <DeliverOilSaleDrawer
        open={deliverDrawerOpen}
        saving={saving}
        sale={sale}
        onClose={() => setDeliverDrawerOpen(false)}
        onConfirm={handleDeliver}
      />
    </div>
  );
}
