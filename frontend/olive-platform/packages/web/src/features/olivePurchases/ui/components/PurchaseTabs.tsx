
import { IconClipboardText, IconDroplet } from "@tabler/icons-react";
import type { PurchaseTab } from "../types/PurchaseTab";

type Props = {
  activeTab: PurchaseTab;
  onChange: (tab: PurchaseTab) => void;
};

const steps: { id: PurchaseTab; label: string; icon: typeof IconClipboardText }[] = [
  { id: "general", label: "Informations générales", icon: IconClipboardText },
  { id: "olives", label: "Olives achetées", icon: IconDroplet },
];

export default function PurchaseTabs({ activeTab, onChange }: Props) {
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