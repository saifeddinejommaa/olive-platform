import type { SeasonStatus } from "./SeasonStatus";

export type Season = {
  id: number;
  label: string;
  startDate: string;
  endDate: string;
  status: SeasonStatus;
  isCurrent: boolean;
};
