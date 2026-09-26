import { useEffect, type ReactNode } from "react";
import { useSeasonStore } from "../../../stores/SeasonStore";
import "./Season.css";

type SeasonGateProps = {
  children: ReactNode;
};

/**
 * Charge les campagnes et n'affiche l'application qu'une fois une campagne
 * sélectionnée : tous les appels d'API partent ainsi avec un seasonId.
 */
export default function SeasonGate({ children }: SeasonGateProps) {
  const hydrated = useSeasonStore((state) => state.hydrated);
  const selectedSeasonId = useSeasonStore((state) => state.selectedSeasonId);
  const loaded = useSeasonStore((state) => state.loaded);
  const error = useSeasonStore((state) => state.error);
  const fetchSeasons = useSeasonStore((state) => state.fetchSeasons);

  useEffect(() => {
    if (hydrated) {
      fetchSeasons();
    }
  }, [hydrated, fetchSeasons]);

  if (loaded && selectedSeasonId != null) {
    return <>{children}</>;
  }

  if (error) {
    return (
      <div className="season-gate">
        <p>{error}</p>

        <button type="button" onClick={() => fetchSeasons()}>
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="season-gate">
      <p>Chargement de la campagne...</p>
    </div>
  );
}
