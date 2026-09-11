import "./ActionCard.css"
import {
  IconEdit,
  IconPlayerPlay,
} from "@tabler/icons-react";

type ActionType = "launch" | "edit";

interface ActionCardProps {
  type: ActionType;
  title: string;
  onClick: () => void;
}

const ACTIONS = {
  launch: {
    icon: IconPlayerPlay,
    className: "action-card--launch",
  },
  edit: {
    icon: IconEdit,
    className: "action-card--edit",
  },
};

const ActionCard = ({
  type,
  title,
  onClick,
}: ActionCardProps) => {
  const action = ACTIONS[type];
  const Icon = action.icon;

  return (
    <button
      type="button"
      className={`action-card ${action.className}`}
      onClick={onClick}
    >
      <Icon
        className="action-card__icon"
        size={18}
        stroke={2}
      />

      <span className="action-card__title">
        {title}
      </span>
    </button>
  );
};

export default ActionCard;