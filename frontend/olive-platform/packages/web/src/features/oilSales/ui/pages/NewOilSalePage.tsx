import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { IconPlus, IconTrash } from "@tabler/icons-react";

import Button from "../../../../common/widgets/button/Button";
import Card from "../../../../common/widgets/card/Card";
import Select from "../../../../common/widgets/select/Select";
import TextInput from "../../../../common/widgets/textInput/TextInput";
import InfoFieldWidget from "../../../../common/widgets/InfoFieldWidget";
import OilGradeBadge from "../../../../common/widgets/oilGradeBadge/OilGradeBadge";
import { usePageTitle } from "../../../../common/hooks/usePageTitle";
import CustomerDrawer from "../../../customers/ui/components/CustomerDrawer";
import { formatAmount, formatQuantity } from "../OilSaleFormat";
import "../../../tanks/ui/Tanks.css";

import type { Customer } from "@olive-platform/core/features/customers/domain/entities/Customer";
import { Autocomplete } from "../../../../common/widgets/autoComplete/AutoComplete";
import { useCustomersAutocomplete } from "../../../customers/ui/hooks/UseCustomersAutocomplete";
import {
  OilSaleStatus,
  type PriceUnit,
} from "@olive-platform/core/features/oilSales/domain/entities/OilSale";
import { OilSaleRepository } from "@olive-platform/core/features/oilSales/data/repositories/OilSaleRepository";
import {
  lineAmount,
  litersToKg,
  saleTotals,
} from "@olive-platform/core/features/oilSales/domain/OilSaleAmounts";
import { TankType, type Tank } from "@olive-platform/core/features/tanks/domain/entities/Tank";
import { GetTanks } from "@olive-platform/core/features/tanks/domain/usecases/GetTanks";
import { tankGrade } from "@olive-platform/core/features/tanks/domain/OilType";

type LineForm = {
  key: number;
  tankId: string;
  quantityLiters: string;
  quantityKg: string;
  // Poids saisi à la main (sinon estimé depuis les litres).
  kgEdited: boolean;
  priceUnit: PriceUnit;
  unitPrice: string;
};

const toNumber = (value: string) => {
  const number = Number(value.replace(",", "."));
  return value.trim() !== "" && Number.isFinite(number) ? number : NaN;
};

const today = () => new Date().toISOString().split("T")[0];

let nextKey = 1;

const newLine = (): LineForm => ({
  key: nextKey++,
  tankId: "",
  quantityLiters: "",
  quantityKg: "",
  kgEdited: false,
  priceUnit: "kg",
  unitPrice: "",
});

const priceUnitOptions = [
  { value: "kg", label: "par kg" },
  { value: "L", label: "par litre" },
];

// Création, ou modification d'une vente en brouillon (/oil-sales/:id/edit).
export default function NewOilSalePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const editedId = id ? Number(id) : null;

  // Référence de la vente modifiée (chargée).
  const [editedReference, setEditedReference] = useState<string | null>(null);

  usePageTitle(
    editedId ? `Modifier la vente ${editedReference ?? ""}` : "Nouvelle vente",
    "Vente d'huile en vrac depuis une ou plusieurs citernes.",
  );

  const [tanks, setTanks] = useState<Tank[]>([]);
  const [customerId, setCustomerId] = useState("");
  // Libellé du client choisi ; la clé remonte la recherche après une création.
  const [customerLabel, setCustomerLabel] = useState<string | undefined>(undefined);
  const [saleDate, setSaleDate] = useState(today());
  const [taxRate, setTaxRate] = useState("0");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<LineForm[]>([newLine()]);
  const [customerDrawerOpen, setCustomerDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      // Vente modifiée : seulement un brouillon, formulaire prérempli.
      const sale = editedId ? await OilSaleRepository.getById(editedId) : null;

      if (sale && sale.status !== OilSaleStatus.Draft) {
        toast.error("Seule une vente en brouillon peut être modifiée.");
        navigate(`/oil-sales/${sale.id}`, { replace: true });
        return;
      }

      // Citernes de stockage actives qui contiennent de l'huile (et celles de la vente).
      const items = await GetTanks({ tankType: TankType.Storage, status: "active" });

      if (cancelled) return;

      const saleTankIds = new Set(sale?.lines.map((line) => line.tankId) ?? []);

      setTanks(
        items.filter(
          (tank) => Number(tank.currentQuantityLiters) > 0 || saleTankIds.has(tank.id),
        ),
      );

      if (sale) {
        setEditedReference(sale.reference);
        setCustomerId(String(sale.customerId));
        setCustomerLabel(`${sale.customerName} — ${sale.customerReference}`);
        setSaleDate(sale.saleDate.split("T")[0]);
        setTaxRate(String(Number(sale.taxRate)));
        setNotes(sale.notes ?? "");
        setLines(
          sale.lines.map((line) => ({
            key: nextKey++,
            tankId: String(line.tankId),
            quantityLiters: String(Number(line.quantityLiters)),
            quantityKg: line.quantityKg !== null ? String(Number(line.quantityKg)) : "",
            // Poids déjà saisi : on ne le recalcule pas depuis les litres.
            kgEdited: line.quantityKg !== null,
            priceUnit: line.priceUnit,
            unitPrice: String(Number(line.unitPrice)),
          })),
        );
      }
    };

    load().catch(() => {
      if (!cancelled) toast.error("Impossible de charger la vente ou les citernes.");
    });

    return () => {
      cancelled = true;
    };
  }, [editedId, navigate]);

  const customerLabelOf = (customer: Pick<Customer, "name" | "reference">) =>
    `${customer.name} — ${customer.reference}`;

  const tankOptions = (line: LineForm) =>
    tanks
      // Une citerne par vente : on masque celles déjà choisies sur une autre ligne.
      .filter(
        (tank) =>
          String(tank.id) === line.tankId ||
          !lines.some((other) => other.tankId === String(tank.id)),
      )
      .map((tank) => ({
        value: String(tank.id),
        label: `${tank.code} · ${tank.oilCategoryLabel} — ${formatQuantity(
          tank.currentQuantityLiters,
          "L",
        )} disponibles`,
      }));

  const updateLine = (key: number, changes: Partial<LineForm>) =>
    setLines((previous) =>
      previous.map((line) => {
        if (line.key !== key) return line;

        const next = { ...line, ...changes };

        // Poids estimé depuis les litres tant qu'il n'a pas été saisi (ticket de pesée).
        if (changes.quantityLiters !== undefined && !next.kgEdited) {
          const liters = toNumber(changes.quantityLiters);
          next.quantityKg = Number.isNaN(liters) ? "" : String(litersToKg(liters));
        }

        return next;
      }),
    );

  // Montant de chaque ligne et totaux, recalculés à la saisie.
  const computed = useMemo(
    () =>
      lines.map((line) => {
        const liters = toNumber(line.quantityLiters);
        const kg = toNumber(line.quantityKg);
        const price = toNumber(line.unitPrice);

        const amount =
          Number.isNaN(liters) || Number.isNaN(price) || (line.priceUnit === "kg" && Number.isNaN(kg))
            ? 0
            : lineAmount(line.priceUnit, liters, kg, price);

        return { liters, kg, price, amount };
      }),
    [lines],
  );

  const subtotal = computed.reduce((total, line) => total + line.amount, 0);
  const rate = Number.isNaN(toNumber(taxRate)) ? 0 : toNumber(taxRate);
  const totals = saleTotals(subtotal, rate);

  const validate = (): string | null => {
    if (!customerId) return "Choisissez le client.";
    if (!saleDate) return "Renseignez la date de vente.";
    if (Number.isNaN(toNumber(taxRate)) || toNumber(taxRate) < 0) return "Taux de TVA invalide.";

    for (const [index, line] of lines.entries()) {
      const { liters, kg, price } = computed[index];
      const tank = tanks.find((item) => String(item.id) === line.tankId);

      if (!tank) return `Ligne ${index + 1} : choisissez la citerne.`;
      if (Number.isNaN(liters) || liters <= 0) return `${tank.code} : renseignez la quantité (L).`;
      if (liters > Number(tank.currentQuantityLiters)) {
        return `${tank.code} ne contient que ${formatQuantity(tank.currentQuantityLiters, "L")}.`;
      }
      if (line.priceUnit === "kg" && (Number.isNaN(kg) || kg <= 0)) {
        return `${tank.code} : renseignez le poids (kg), le prix est au kg.`;
      }
      if (Number.isNaN(price) || price < 0) return `${tank.code} : renseignez le prix unitaire.`;
    }

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const params = {
        customerId: Number(customerId),
        saleDate: new Date(`${saleDate}T12:00:00`).toISOString(),
        taxRate: rate,
        notes: notes.trim() || undefined,
        lines: lines.map((line, index) => ({
          tankId: Number(line.tankId),
          quantityLiters: computed[index].liters,
          quantityKg: Number.isNaN(computed[index].kg) ? undefined : computed[index].kg,
          priceUnit: line.priceUnit,
          unitPrice: computed[index].price,
        })),
      };

      if (editedId) {
        await OilSaleRepository.update(editedId, params);
        toast.success(`Vente ${editedReference ?? ""} modifiée.`);
        navigate(`/oil-sales/${editedId}`);
      } else {
        const id = await OilSaleRepository.create(params);
        toast.success("Vente créée en brouillon : validez la livraison pour sortir l'huile des citernes.");
        navigate(`/oil-sales/${id}`);
      }
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : editedId
            ? "Impossible de modifier la vente."
            : "Impossible de créer la vente.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="feature-page">
      {/* ==================== CLIENT ==================== */}
      <Card>
        <div className="filters">
          <div className="filters-header">
            <div>
              <h3>Client et vente</h3>
              <span>Acheteur, date et TVA de la vente.</span>
            </div>
          </div>

          <div className="info-grid">
            <div className="filter-item">
              <span className="filter-item-label">Client *</span>
              <Autocomplete
                key={customerLabel ?? "customer"}
                defaultLabel={customerLabel}
                useSearch={useCustomersAutocomplete}
                getLabel={customerLabelOf}
                onSelect={(customer) => {
                  setCustomerId(String(customer.id));
                  setError(null);
                }}
                placeholder="Rechercher un client..."
                width="100%"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCustomerDrawerOpen(true)}
                disabled={saving}
              >
                <IconPlus size={14} />
                Nouveau client
              </Button>
            </div>

            <TextInput
              label="Date de vente *"
              type="date"
              value={saleDate}
              onChange={(event) => setSaleDate(event.target.value)}
              disabled={saving}
            />

            <TextInput
              label="TVA (%)"
              type="number"
              min="0"
              step="0.1"
              value={taxRate}
              onChange={(event) => setTaxRate(event.target.value)}
              disabled={saving}
            />

            <div style={{ gridColumn: "1 / -1" }}>
              <TextInput
                label="Notes"
                placeholder="Camion, chauffeur, conditions..."
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                disabled={saving}
              />
            </div>
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
                Une ligne par citerne. Le poids est estimé depuis les litres (0,916 kg/L) :
                remplacez-le par celui du ticket de pesée.
              </span>
            </div>
          </div>

          {tanks.length === 0 && (
            <div className="close-step__note close-step__note--warning">
              Aucune citerne de stockage ne contient d'huile à vendre.
            </div>
          )}

          {lines.map((line, index) => {
            const tank = tanks.find((item) => String(item.id) === line.tankId);

            return (
              <div key={line.key} className="sale-line">
                <div className="sale-line__header">
                  <strong>Citerne {index + 1}</strong>
                  {tank && <OilGradeBadge grade={tankGrade(tank)} />}
                  {lines.length > 1 && (
                    <button
                      type="button"
                      className="sale-line__remove"
                      title="Retirer la ligne"
                      onClick={() => setLines((previous) => previous.filter((item) => item.key !== line.key))}
                      disabled={saving}
                    >
                      <IconTrash size={16} />
                    </button>
                  )}
                </div>

                <div className="sale-line__grid">
                  <div className="sale-line__tank">
                    <Select
                      label="Citerne *"
                      placeholder="Sélectionnez une citerne"
                      options={tankOptions(line)}
                      value={line.tankId}
                      onChange={(event) => updateLine(line.key, { tankId: event.target.value })}
                      disabled={saving}
                    />
                  </div>

                  <TextInput
                    label="Quantité (L) *"
                    type="number"
                    min="0"
                    step="0.1"
                    value={line.quantityLiters}
                    onChange={(event) => updateLine(line.key, { quantityLiters: event.target.value })}
                    disabled={saving}
                  />

                  <TextInput
                    label={line.priceUnit === "kg" ? "Poids (kg) *" : "Poids (kg)"}
                    type="number"
                    min="0"
                    step="0.1"
                    value={line.quantityKg}
                    onChange={(event) =>
                      updateLine(line.key, { quantityKg: event.target.value, kgEdited: true })
                    }
                    disabled={saving}
                  />

                  <Select
                    label="Prix"
                    options={priceUnitOptions}
                    value={line.priceUnit}
                    onChange={(event) =>
                      updateLine(line.key, { priceUnit: event.target.value as PriceUnit })
                    }
                    disabled={saving}
                  />

                  <TextInput
                    label={`Prix HT (DT/${line.priceUnit}) *`}
                    type="number"
                    min="0"
                    step="0.001"
                    value={line.unitPrice}
                    onChange={(event) => updateLine(line.key, { unitPrice: event.target.value })}
                    disabled={saving}
                  />

                  <InfoFieldWidget label="Montant HT" value={formatAmount(computed[index].amount)} />
                </div>
              </div>
            );
          })}

          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLines((previous) => [...previous, newLine()])}
              disabled={saving || lines.length >= tanks.length}
            >
              <IconPlus size={14} />
              Ajouter une citerne
            </Button>
          </div>

          {/* ==================== TOTAUX ==================== */}
          <div className="sale-totals">
            <span>Total HT</span>
            <strong>{formatAmount(totals.subtotal)}</strong>
            <span>TVA ({rate.toLocaleString("fr-FR")} %)</span>
            <strong>{formatAmount(totals.taxAmount)}</strong>
            <span className="sale-totals__grand">Total TTC</span>
            <strong className="sale-totals__grand">{formatAmount(totals.total)}</strong>
          </div>
        </div>
      </Card>

      {error && <span className="field-error">{error}</span>}

      {/* Barre d'actions fixée en bas de l'écran */}
      <div className="fixed-actions-spacer" />

      <div className="fixed-actions-bar">
        <Button
          variant="secondary"
          onClick={() => navigate(editedId ? `/oil-sales/${editedId}` : "/oil-sales")}
          disabled={saving}
        >
          Annuler
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={saving}>
          {saving
            ? "Enregistrement..."
            : editedId
              ? "Enregistrer les modifications"
              : "Créer la vente"}
        </Button>
      </div>

      <CustomerDrawer
        open={customerDrawerOpen}
        customer={null}
        onClose={() => setCustomerDrawerOpen(false)}
        onSaved={(id, name) => {
          // Le client créé est sélectionné directement.
          setCustomerId(String(id));
          setCustomerLabel(name);
        }}
      />
    </div>
  );
}
