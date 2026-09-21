export const OliveVarieties = {
  Arbequina: 5,
  Koroneiki: 6,
  Arbosana: 7,
  Chemlali: 8,
} as const;

export type OliveVarieties =
  (typeof OliveVarieties)[keyof typeof OliveVarieties];
