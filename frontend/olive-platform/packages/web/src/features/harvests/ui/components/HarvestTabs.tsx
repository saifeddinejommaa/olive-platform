import { IconClipboardText, IconBasket } from "@tabler/icons-react";

export type HarvestTab = "general" | "olives";

type Props = {
  activeTab: HarvestTab;
  onChange: (tab: HarvestTab) => void;
};

const steps: { id: HarvestTab; label: string; icon: typeof IconClipboardText }[] = [
  { id: "general", label: "Informations générales", icon: IconClipboardText },
  { id: "olives", label: "Olives récoltées", icon: IconBasket },
];

export default function HarvestTabs({ activeTab, onChange }: Props) {
  const activeIndex = steps.findIndex((step) => step.id === activeTab);

  return (
    <div className="steps-tabs">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = step.id === activeTab;
        const isPastOrActive = index <= activeIndex;

        return (
          <div key={step.id} style={{ display: "flex", alignItems: "center" }}>
            <button
              type="button"
              className={`steps-tabs__step ${isActive ? "steps-tabs__step--active" : ""}`}
              onClick={() => onChange(step.id)}
            >
              <span className="steps-tabs__circle">
                <Icon size={16} stroke={2} />
              </span>
              <span className="steps-tabs__label">{step.label}</span>
            </button>

            {index < steps.length - 1 && (
              <div
                className={`steps-tabs__connector ${
                  isPastOrActive ? "steps-tabs__connector--filled" : ""
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}