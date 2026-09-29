import type { Tank } from "@olive-platform/core/features/tanks/domain/entities/Tank";
import { TankType } from "@olive-platform/core/features/tanks/domain/entities/Tank";
import { formatLiters } from "../TankFormat";
import "../Tanks.css";

type Props = {
  tank: Tank;
  large?: boolean;
};

// Jauge de remplissage : olive pour le stockage, or pour l'huile en attente d'analyse.
export default function TankGauge({ tank, large }: Props) {
  const percentage = Math.min(100, Math.max(0, Number(tank.fillPercentage) || 0));

  return (
    <div className={`tank-gauge${large ? " tank-gauge--large" : ""}`}>
      <div className="tank-gauge__bar">
        <div
          className={`tank-gauge__fill${
            tank.tankType === TankType.Buffer ? " tank-gauge__fill--pending" : ""
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <span className="tank-gauge__caption">
        <strong>{formatLiters(tank.currentQuantityLiters)}</strong> /{" "}
        {formatLiters(tank.capacityLiters)} · {percentage.toLocaleString("fr-FR")} %
      </span>
    </div>
  );
}
