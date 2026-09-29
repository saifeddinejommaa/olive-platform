import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Card from "../../../../common/widgets/card/Card";
import DataTable from "../../../../common/widgets/tables/OrdersTable";
import InfoFieldWidget from "../../../../common/widgets/InfoFieldWidget";
import OilGradeBadge from "../../../../common/widgets/oilGradeBadge/OilGradeBadge";
import { usePageTitle } from "../../../../common/hooks/usePageTitle";
import { renderStatus } from "../../../../common/status/StatusUtils";
import { productionStatusConfig } from "../../../../common/status/ProductionStatusConfig";
import TankGauge from "../components/TankGauge";
import { formatLiters, tankStatusLabel, tankTitle } from "../TankFormat";
import "../Tanks.css";

import { TankType } from "@olive-platform/core/features/tanks/domain/entities/Tank";
import type {
  TankContent,
  TankDetails,
  TankMovement,
} from "@olive-platform/core/features/tanks/domain/entities/TankDetails";
import { GetTankDetails } from "@olive-platform/core/features/tanks/domain/usecases/GetTankDetails";
import { bufferOilState, oilTypeOf } from "@olive-platform/core/features/tanks/domain/OilType";
import { OIL_GRADE_LABELS } from "@olive-platform/core/features/oilQuality/OilGrade";

const formatDate = (value: string) => new Date(value).toLocaleDateString("fr-FR");

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function TankDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [tank, setTank] = useState<TankDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  usePageTitle(
    tank ? `Citerne ${tankTitle(tank)}` : "Citerne",
    "Huile présente dans la citerne et historique de ses mouvements.",
  );

  useEffect(() => {
    const tankId = Number(id);

    if (!id || Number.isNaN(tankId)) {
      setError("Identifiant de citerne invalide.");
      return;
    }

    let cancelled = false;

    setLoading(true);
    setError(null);

    GetTankDetails(tankId)
      .then((details) => {
        // Contenu et mouvements absents si l'API n'est pas à jour.
        if (!cancelled)
          setTank({
            ...details,
            contents: details.contents ?? [],
            movements: details.movements ?? [],
          });
      })
      .catch(() => {
        if (!cancelled) setError("Impossible de charger la citerne.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <div className="feature-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!tank) {
    return (
      <div className="feature-page">
        {loading && <div className="loading">Chargement de la citerne...</div>}
      </div>
    );
  }

  const isBuffer = tank.tankType === TankType.Buffer;

  // Tampon : l'état réel de l'huile (analyse planifiée, en cours ou terminée).
  const bufferState = bufferOilState(tank);
  const bufferStateLabel =
    bufferState.kind === "empty"
      ? "Libre"
      : bufferState.kind === "analysed"
        ? `Analysée${bufferState.grade ? ` : ${OIL_GRADE_LABELS[bufferState.grade]}` : ""} · à transférer`
        : bufferState.label;

  const contentColumns = [
    {
      key: "batchNumber" as keyof TankContent,
      label: "Lot d'huile",
      render: (content: TankContent) => (
        <div className="tank-cell">
          <strong>{content.batchNumber}</strong>
          <span className="tank-cell__sub">
            Produit le {formatDate(content.productionDate)}
          </span>
        </div>
      ),
    },
    {
      key: "pressingNumber" as keyof TankContent,
      label: "Pression",
      render: (content: TankContent) => content.pressingNumber ?? "-",
    },
    {
      key: "quantityLiters" as keyof TankContent,
      label: "Quantité",
      render: (content: TankContent) => <strong>{formatLiters(content.quantityLiters)}</strong>,
    },
    {
      key: "oilBatchId" as keyof TankContent,
      label: "Type d'huile",
      render: (content: TankContent) => {
        const oilType = oilTypeOf(tank, content);

        return (
          <div className="tank-cell">
            <OilGradeBadge grade={oilType.grade} />
            {oilType.source === "analysis" && (
              <span className="tank-cell__sub">
                Selon l'analyse
                {content.acidityPercentage != null &&
                  ` · acidité ${content.acidityPercentage.toLocaleString("fr-FR")} %`}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "oilAnalysisStatus" as keyof TankContent,
      label: "Analyse d'huile",
      render: (content: TankContent) =>
        content.oilAnalysisStatus != null ? (
          <div className="tank-cell">
            {renderStatus(content.oilAnalysisStatus, productionStatusConfig)}
            <span className="tank-cell__sub">{content.oilAnalysisReference}</span>
          </div>
        ) : (
          "-"
        ),
    },
  ];

  const movementColumns = [
    {
      key: "movementDate" as keyof TankMovement,
      label: "Date",
      render: (movement: TankMovement) => formatDateTime(movement.movementDate),
    },
    {
      key: "movementNumber" as keyof TankMovement,
      label: "Mouvement",
      render: (movement: TankMovement) => (
        <div className="tank-cell">
          <strong>{movement.movementNumber}</strong>
          <span className="tank-cell__sub">{movement.movementTypeLabel ?? "-"}</span>
        </div>
      ),
    },
    {
      key: "quantityLiters" as keyof TankMovement,
      label: "Quantité",
      render: (movement: TankMovement) => (
        <span className={movement.isIncoming ? "tank-movement--in" : "tank-movement--out"}>
          {movement.isIncoming ? "+" : "−"} {formatLiters(movement.quantityLiters)}
        </span>
      ),
    },
    {
      key: "otherTankCode" as keyof TankMovement,
      label: "Provenance / destination",
      render: (movement: TankMovement) =>
        movement.otherTankCode
          ? `${movement.isIncoming ? "De" : "Vers"} ${movement.otherTankCode}`
          : movement.pressingNumber
            ? `Pression ${movement.pressingNumber}`
            : "-",
    },
    {
      key: "batchNumber" as keyof TankMovement,
      label: "Lot d'huile",
      render: (movement: TankMovement) => movement.batchNumber ?? "-",
    },
  ];

  return (
    <div className="feature-page">
      <Card>
        <div className="filters">
          <div className="filters-header">
            <h3>Informations</h3>
          </div>

          <TankGauge tank={tank} large />

          <div className="info-grid">
            <InfoFieldWidget label="Type" value={tank.tankTypeLabel} />
            {isBuffer ? (
              <InfoFieldWidget label="État de l'huile" value={bufferStateLabel} />
            ) : (
              <InfoFieldWidget label="Catégorie d'huile" value={tank.oilCategoryLabel} />
            )}
            <InfoFieldWidget label="Statut" value={tankStatusLabel(tank.status)} />
            <InfoFieldWidget label="Capacité" value={formatLiters(tank.capacityLiters)} />
            <InfoFieldWidget label="Contenu" value={formatLiters(tank.currentQuantityLiters)} />
            <InfoFieldWidget label="Place libre" value={formatLiters(tank.availableCapacityLiters)} />
            {tank.notes && <InfoFieldWidget label="Notes" value={tank.notes} fullWidth />}
          </div>
        </div>
      </Card>

      <Card>
        <div className="filters">
          <div className="filters-header">
            <h3>Huile présente</h3>
            <span>
              {!isBuffer
                ? "Lots d'huile stockés dans cette citerne."
                : bufferState.kind === "analysed"
                  ? "Huile analysée : transférez-la vers le stockage depuis son analyse d'huile."
                  : "L'huile attend ici le résultat de son analyse avant d'être stockée."}
            </span>
          </div>

          {tank.contents.length === 0 ? (
            <span className="tank-cell__sub">La citerne est vide.</span>
          ) : (
            <DataTable
              data={tank.contents}
              columns={contentColumns}
              onRowClick={(content: TankContent) => {
                if (content.oilAnalysisId) navigate(`/Oil-analyses/${content.oilAnalysisId}`);
                else if (content.pressingOperationId)
                  navigate(`/production/pressing-operations/${content.pressingOperationId}`);
              }}
              pageNumber={1}
              pageSize={Math.max(tank.contents.length, 1)}
              totalCount={tank.contents.length}
              onPageChange={() => {}}
            />
          )}
        </div>
      </Card>

      <Card>
        <div className="filters">
          <div className="filters-header">
            <h3>Mouvements</h3>
            <span>Les 50 derniers mouvements d'huile de la citerne.</span>
          </div>

          {tank.movements.length === 0 ? (
            <span className="tank-cell__sub">Aucun mouvement.</span>
          ) : (
            <DataTable
              data={tank.movements}
              columns={movementColumns}
              pageNumber={1}
              pageSize={Math.max(tank.movements.length, 1)}
              totalCount={tank.movements.length}
              onPageChange={() => {}}
            />
          )}
        </div>
      </Card>
    </div>
  );
}
