import { useNavigate } from "react-router-dom";

import Card from "../../../../../common/widgets/card/Card";
import { formatLiters } from "../../../../tanks/ui/TankFormat";
import "../../../../tanks/ui/Tanks.css";

import type { OilLocation } from "@olive-platform/core/features/analyses/oilAnalyses/domain/entities/OilLocation";
import { TankType } from "@olive-platform/core/features/tanks/domain/entities/Tank";

type Props = {
  locations: OilLocation[];
  // Huile produite par la pression source (L).
  oilQuantityLiters?: number;
};

/**
 * Position de l'huile analysée : les citernes qui la contiennent aujourd'hui.
 */
export default function OilLocationCard({ locations, oilQuantityLiters }: Props) {
  const navigate = useNavigate();

  return (
    <Card>
      <div className="filters">
        <div className="filters-header">
          <div>
            <h3>Position de l'huile</h3>
            <span>Citerne(s) contenant l'huile analysée.</span>
          </div>
        </div>

        {locations.length === 0 ? (
          <span className="tank-cell__sub">
            {oilQuantityLiters
              ? `Les ${formatLiters(oilQuantityLiters)} produits ne sont dans aucune citerne.`
              : "L'huile de cette source n'est dans aucune citerne."}
          </span>
        ) : (
          <div className="oil-location-list">
            {locations.map((location) => {
              const percentage = Math.min(
                100,
                (Number(location.quantityLiters) / Number(location.capacityLiters)) * 100,
              );

              return (
                <button
                  type="button"
                  key={location.tankId}
                  className="oil-location"
                  title="Ouvrir la citerne"
                  onClick={() => navigate(`/tanks/${location.tankId}`)}
                >
                  <div className="oil-location__header">
                    <strong>
                      {location.tankCode}
                      {location.tankName ? ` · ${location.tankName}` : ""}
                    </strong>
                    <span className="oil-location__tag">{location.tankTypeLabel}</span>
                  </div>

                  <div className="tank-gauge">
                    <div className="tank-gauge__bar">
                      <div
                        className={`tank-gauge__fill${
                          location.tankType === TankType.Buffer
                            ? " tank-gauge__fill--pending"
                            : ""
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  <span className="tank-gauge__caption">
                    <strong>{formatLiters(location.quantityLiters)}</strong> de cette huile ·
                    capacité {formatLiters(location.capacityLiters)} · {location.oilCategoryLabel}
                    {location.batchNumbers ? ` · lot ${location.batchNumbers}` : ""}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
