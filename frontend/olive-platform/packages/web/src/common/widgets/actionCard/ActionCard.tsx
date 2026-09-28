import "./ActionCard.css"
import {
  IconDropletPlus,
  IconBasketPlus,
  IconEdit,
  IconPlayerPlay,
} from "@tabler/icons-react";

// launch / edit : bouton avec libellé.
// press / harvest : bouton icône seule (libellé en infobulle).
type ActionType = "launch" | "edit" | "press" | "harvest";

interface ActionCardProps {
  type: ActionType;
  title: string;
  onClick: () => void;
}

const ACTIONS = {
  launch: {
    icon: IconPlayerPlay,
    className: "action-card--launch",
    iconOnly: false,
  },
  edit: {
    icon: IconEdit,
    className: "action-card--edit",
    iconOnly: false,
  },
  // Lancer une pression : une goutte d'huile « + ».
  press: {
    icon: IconDropletPlus,
    className: "action-card--icon",
    iconOnly: true,
  },
  // Lancer une récolte : le panier du menu « Récoltes » « + ».
  harvest: {
    icon: IconBasketPlus,
    className: "action-card--icon",
    iconOnly: true,
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
      title={title}
      aria-label={title}
      onClick={(event) => {
        // Dans une ligne cliquable : l'action ne doit pas ouvrir le détail.
        event.stopPropagation();
        onClick();
      }}
    >
      <Icon
        className="action-card__icon"
        size={18}
        stroke={2}
      />

      {!action.iconOnly && (
        <span className="action-card__title">
          {title}
        </span>
      )}
    </button>
  );
};

export default ActionCard;
