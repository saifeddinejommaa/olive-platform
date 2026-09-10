// src/common/widgets/progressBar/ProgressBar.tsx
import "./ProgressBar.css";

interface ProgressBarProps {
  value: number;
  secondaryValue?: number;
  label?: string;
  showValue?: boolean;
}

export default function ProgressBar({
  value,
  secondaryValue,
  label,
  showValue = true,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const secondaryWidth =
    secondaryValue !== undefined
      ? Math.min(100 - clampedValue, Math.max(0, secondaryValue))
      : undefined;

  const hasVisibleSecondary = secondaryWidth !== undefined && secondaryWidth > 0;

  // Le dernier segment visible (celui qui touche potentiellement le bord droit)
  // reçoit l'arrondi à droite ; l'autre reste carré à droite.
  const primaryRoundedRight = !hasVisibleSecondary;

  return (
    <div className="progress-bar">
      {label && <span className="progress-bar-label">{label}</span>}

      <div className="progress-bar-track">
        <div
          className={`progress-bar-fill ${primaryRoundedRight ? "rounded-right" : ""}`}
          style={{ width: `${clampedValue}%` }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />

        {hasVisibleSecondary && (
          <div
            className="progress-bar-fill-secondary rounded-right"
            style={{ left: `${clampedValue}%`, width: `${secondaryWidth}%` }}
          />
        )}
      </div>

      {showValue && (
        <span className="progress-bar-value">
          {clampedValue.toFixed(0)}% récolté
          {secondaryValue !== undefined && ` · ${secondaryValue.toFixed(0)}% planifié`}
        </span>
      )}
    </div>
  );
}