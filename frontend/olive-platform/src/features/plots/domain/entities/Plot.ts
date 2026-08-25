export interface Plot {
  id: number
  reference: string
  name: string
  areaHectares: number
  plantingYear: number
  location: string
  numberOfTrees: number
  notes: string | null
  createdAt: string
}