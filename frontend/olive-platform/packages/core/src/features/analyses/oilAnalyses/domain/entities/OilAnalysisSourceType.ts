export const OilAnalysisSourceType = {
  PressingOperation: 1,
  Tank: 2,
} as const;

export type OilAnalysisSourceType =
  (typeof OilAnalysisSourceType)[keyof typeof OilAnalysisSourceType];
