export type Harvest = {
  id: number
  harvestNumber: string

  plotId: number

  harvestDate: string

  quantityKg: number

  qualityGrade: string | null

  notes: string | null
}