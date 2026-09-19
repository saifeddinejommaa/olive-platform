import {
  IconClock,
  IconHistory,
} from "@tabler/icons-react";

export type PaymentTab =
  | "pending"
  | "history";

type Props = {
  activeTab: PaymentTab;
  onChange: (tab: PaymentTab) => void;
};

const tabs: {
  id: PaymentTab;
  label: string;
  icon: typeof IconClock;
}[] = [
  {
    id: "pending",
    label: "Paiements en attente",
    icon: IconClock,
  },
  {
    id: "history",
    label: "Historique des paiements",
    icon: IconHistory,
  },
];

export default function PaymentTabs({
  activeTab,
  onChange,
}: Props) {
  const activeIndex =
    tabs.findIndex(
      (tab) => tab.id === activeTab,
    );

  return (
    <div className="steps-tabs">
      {tabs.map((tab, index) => {
        const Icon = tab.icon;

        const isActive =
          tab.id === activeTab;

        const isPastOrActive =
          index <= activeIndex;

        return (
          <div
            key={tab.id}
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <button
              type="button"
              className={`steps-tabs__step ${
                isActive
                  ? "steps-tabs__step--active"
                  : ""
              }`}
              onClick={() =>
                onChange(tab.id)
              }
            >
              <span className="steps-tabs__circle">
                <Icon
                  size={16}
                  stroke={2}
                />
              </span>

              <span className="steps-tabs__label">
                {tab.label}
              </span>
            </button>

            {index < tabs.length - 1 && (
              <div
                className={`steps-tabs__connector ${
                  isPastOrActive
                    ? "steps-tabs__connector--filled"
                    : ""
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}