import { SeasonStatus } from "@olive-platform/core/features/seasons/domain/entities/SeasonStatus";
import { useSeasonStore } from "../../../stores/SeasonStore";
import Select from "../select/Select";
import "./Season.css";

export default function SeasonSelector() {
  const seasons = useSeasonStore((state) => state.seasons);
  const selectedSeasonId = useSeasonStore((state) => state.selectedSeasonId);
  const selectSeason = useSeasonStore((state) => state.selectSeason);

  const options = seasons.map((season) => ({
    value: String(season.id),
    label:
      season.status === SeasonStatus.Closed
        ? `Campagne ${season.label} (clôturée)`
        : `Campagne ${season.label}`,
  }));

  return (
    <div className="topbar-season" title="Campagne oléicole">
      <Select
        options={options}
        value={selectedSeasonId != null ? String(selectedSeasonId) : ""}
        onChange={(event) => selectSeason(Number(event.target.value))}
      />
    </div>
  );
}
