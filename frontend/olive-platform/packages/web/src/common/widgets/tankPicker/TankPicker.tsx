import "./TankPicker.css";

const formatLiters = (value: number) =>
  `${value.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} L`;

// Données minimales d'une citerne pour la jauge.
export type TankPickerItem = {
  id: number;
  code: string;
  name?: string | null;
  capacityLiters: number;
  levelLiters: number;
};

type Props<T extends TankPickerItem> = {
  tanks: T[];
  // Volume à ajouter (0 tant qu'il n'est pas saisi).
  addedLiters: number;
  selectedTankId: number | null;
  // Citerne conseillée (badge « Conseillée »).
  suggestedTankId?: number | null;
  // Étiquette de la citerne (type ou catégorie d'huile).
  tagOf: (tank: T) => string;
  // Raison pour laquelle une citerne n'est pas sélectionnable (null = sélectionnable).
  unavailableReason: (tank: T) => string | null;
  disabled?: boolean;
  onSelect: (tankId: number) => void;
};

/**
 * Liste de citernes avec jauge : vert = contenu actuel, or = ce qui est ajouté.
 */
export default function TankPicker<T extends TankPickerItem>({
  tanks,
  addedLiters,
  selectedTankId,
  suggestedTankId,
  tagOf,
  unavailableReason,
  disabled,
  onSelect,
}: Props<T>) {
  return (
    <div className="tank-picker">
      {tanks.map((tank) => {
        const reason = unavailableReason(tank);
        const selected = tank.id === selectedTankId;
        const after = tank.levelLiters + (reason ? 0 : addedLiters);
        const beforePct = (tank.levelLiters / tank.capacityLiters) * 100;
        const afterPct = Math.min(100, (after / tank.capacityLiters) * 100);

        return (
          <label
            key={tank.id}
            className={[
              "tank-picker__tank",
              selected ? "tank-picker__tank--selected" : "",
              reason ? "tank-picker__tank--disabled" : "",
            ].join(" ")}
          >
            <input
              type="radio"
              name="tank-picker"
              checked={selected}
              disabled={disabled || !!reason}
              onChange={() => onSelect(tank.id)}
            />

            <div className="tank-picker__body">
              <div className="tank-picker__header">
                <strong>
                  {tank.code}
                  {tank.name ? ` · ${tank.name}` : ""}
                </strong>
                <span className="tank-picker__tag">{tagOf(tank)}</span>
                {tank.id === suggestedTankId && !reason && (
                  <span className="tank-picker__tag tank-picker__tag--suggested">
                    Conseillée
                  </span>
                )}
              </div>

              <div className="tank-picker__gauge">
                <div className="tank-picker__gauge-after" style={{ width: `${afterPct}%` }} />
                <div className="tank-picker__gauge-before" style={{ width: `${beforePct}%` }} />
              </div>

              <div className="tank-picker__meta">
                {reason ? (
                  <>
                    {formatLiters(tank.levelLiters)} / {formatLiters(tank.capacityLiters)} · {reason}
                  </>
                ) : addedLiters > 0 ? (
                  <>
                    <strong>{formatLiters(tank.levelLiters)}</strong> + {formatLiters(addedLiters)} →{" "}
                    <strong>{formatLiters(after)}</strong> / {formatLiters(tank.capacityLiters)} (
                    {Math.round(afterPct)} %) · libre après : {formatLiters(tank.capacityLiters - after)}
                  </>
                ) : (
                  <>
                    {formatLiters(tank.levelLiters)} / {formatLiters(tank.capacityLiters)} · libre :{" "}
                    {formatLiters(tank.capacityLiters - tank.levelLiters)}
                  </>
                )}
              </div>
            </div>
          </label>
        );
      })}

      <div className="tank-picker__legend">
        <span className="tank-picker__legend-dot tank-picker__legend-dot--before" /> contenu actuel
        <span className="tank-picker__legend-dot tank-picker__legend-dot--after" /> ajout
      </div>
    </div>
  );
}
