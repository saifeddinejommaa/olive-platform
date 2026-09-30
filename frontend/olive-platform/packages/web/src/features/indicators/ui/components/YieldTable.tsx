import Card from "../../../../common/widgets/card/Card";
import DataTable from "../../../../common/widgets/tables/OrdersTable";
import "../../../tanks/ui/Tanks.css";

import type { YieldRow } from "@olive-platform/core/features/indicators/domain/entities/YieldIndicators";

const formatNumber = (value: number, digits = 1) =>
  Number(value).toLocaleString("fr-FR", { maximumFractionDigits: digits });

type Props = {
  title: string;
  description: string;
  // Libellé de la première colonne (Variété, Parcelle, Fournisseur).
  groupLabel: string;
  rows: YieldRow[];
  // Rendement moyen de la campagne, pour situer chaque ligne.
  averageLitersPer100Kg: number;
  emptyMessage: string;
};

// Tableau de rendements, du meilleur au moins bon.
export default function YieldTable({
  title,
  description,
  groupLabel,
  rows,
  averageLitersPer100Kg,
  emptyMessage,
}: Props) {
  const columns = [
    {
      key: "label" as keyof YieldRow,
      label: groupLabel,
      render: (row: YieldRow) => (
        <div className="tank-cell">
          <strong>{row.label}</strong>
          <span className="tank-cell__sub">
            {row.pressingsCount} pression{row.pressingsCount > 1 ? "s" : ""}
            {row.mixedPressingsCount > 0 &&
              ` · ${row.mixedPressingsCount} mélangée${row.mixedPressingsCount > 1 ? "s" : ""} (moyenne)`}
          </span>
        </div>
      ),
    },
    {
      key: "oliveKg" as keyof YieldRow,
      label: "Olives pressées",
      render: (row: YieldRow) => <span className="tank-nowrap">{formatNumber(row.oliveKg, 0)} kg</span>,
    },
    {
      key: "oilLiters" as keyof YieldRow,
      label: "Huile",
      render: (row: YieldRow) => <span className="tank-nowrap">{formatNumber(row.oilLiters)} L</span>,
    },
    {
      key: "litersPer100Kg" as keyof YieldRow,
      label: "L / 100 kg",
      render: (row: YieldRow) => {
        const gap = row.litersPer100Kg - averageLitersPer100Kg;

        return (
          <div className="tank-cell">
            <strong className="tank-nowrap">{formatNumber(row.litersPer100Kg, 2)} L</strong>
            {averageLitersPer100Kg > 0 && Math.abs(gap) >= 0.01 && (
              <span
                className="tank-cell__sub tank-nowrap"
                style={{ color: gap >= 0 ? "var(--color-olive-700)" : "var(--color-rust-600)" }}
              >
                {gap >= 0 ? "+" : ""}
                {formatNumber(gap, 2)} vs moyenne
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "yieldPercentage" as keyof YieldRow,
      label: "Rendement",
      render: (row: YieldRow) => (
        <span className="tank-nowrap">{formatNumber(row.yieldPercentage, 2)} %</span>
      ),
    },
  ];

  return (
    <Card>
      <div className="filters">
        <div className="filters-header">
          <div>
            <h3>{title}</h3>
            <span>{description}</span>
          </div>
        </div>

        {rows.length === 0 ? (
          <span className="tank-cell__sub">{emptyMessage}</span>
        ) : (
          <DataTable
            data={rows}
            columns={columns}
            pageNumber={1}
            pageSize={Math.max(rows.length, 1)}
            totalCount={rows.length}
            onPageChange={() => {}}
          />
        )}
      </div>
    </Card>
  );
}
