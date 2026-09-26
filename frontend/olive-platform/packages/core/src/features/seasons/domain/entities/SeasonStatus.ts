export const SeasonStatus = {
  Open: 1,
  Closed: 2,
} as const;

export type SeasonStatus = (typeof SeasonStatus)[keyof typeof SeasonStatus];
