import { useId } from "react";
import { IconShoppingCart, IconTrees } from "@tabler/icons-react";
import type { InputSourceType } from "./InputTypes";

// ============================================================
// TYPES
// ============================================================

type SourceTypeSelectorProps = {
  value: InputSourceType;

  onChange: (value: InputSourceType) => void;
};

const options: {
  value: InputSourceType;
  label: string;
  icon: typeof IconTrees;
}[] = [
  { value: "harvest", label: "Récolte", icon: IconTrees },
  { value: "purchase", label: "Achat", icon: IconShoppingCart },
];

// ============================================================
// COMPONENT
// ============================================================

export default function SourceTypeSelector({
  value,
  onChange,
}: SourceTypeSelectorProps) {
  // Nom de groupe unique : chaque ligne d'olives a son propre choix.
  const groupName = useId();

  return (
    <div>
      <label>Source</label>

      <div className="source-type-selector" role="radiogroup">
        {options.map((option) => {
          const Icon = option.icon;
          const selected = value === option.value;

          return (
            <label
              key={option.value}
              className={[
                "source-type-option",
                selected ? "source-type-option--selected" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <input
                type="radio"
                name={groupName}
                checked={selected}
                onChange={() => onChange(option.value)}
              />
              <Icon size={16} stroke={2} />
              {option.label}
            </label>
          );
        })}
      </div>
    </div>
  );
}
