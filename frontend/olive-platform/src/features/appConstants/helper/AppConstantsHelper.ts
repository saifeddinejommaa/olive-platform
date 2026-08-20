import {
  OliveVarieties,
  type OliveVarieties as OliveVariety,
} from '../../shared/entities/OliveVarieties'

export function getOliveVarietyLabel(
  variety: OliveVariety
): string {

  const entry =
    Object.entries(
      OliveVarieties
    ).find(
      ([, value]) =>
        value === variety
    )

  return entry?.[0] ?? 'Inconnue'
}