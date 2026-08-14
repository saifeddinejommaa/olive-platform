import { useState } from 'react'
import DataTable from '../../../../common/widgets/tables/OrdersTable'

type Harvest = {
  id: number
  harvestNumber: string
  plotCode: string | null
  harvestDate: string
  quantityKg: number
  qualityGrade: string | null
}

const mockHarvests: Harvest[] = []

export default function HarvestsPage() {
  const [pageNumber, setPageNumber] = useState(1)

  const columns = [
    {
      key: 'harvestNumber' as keyof Harvest,
      label: 'N° Récolte',
    },
    {
      key: 'plotCode' as keyof Harvest,
      label: 'Parcelle',
    },
    {
      key: 'harvestDate' as keyof Harvest,
      label: 'Date',
    },
    {
      key: 'quantityKg' as keyof Harvest,
      label: 'Quantité',
      render: (item: Harvest) =>
        `${item.quantityKg.toLocaleString()} kg`,
    },
    {
      key: 'qualityGrade' as keyof Harvest,
      label: 'Qualité',
    },
  ]

  return (
    <div className="feature-page">

      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">
            Récoltes
          </h1>

          <p className="page-description">
            Suivi des récoltes d’olives.
          </p>
        </div>
      </div>

      <div className="filters card">
        <input placeholder="N° récolte..." />
        <input placeholder="Parcelle..." />

        <button className="secondary-button">
          Rechercher
        </button>
      </div>

      <DataTable
        data={mockHarvests}
        columns={columns}
        pageNumber={pageNumber}
        pageSize={10}
        totalCount={mockHarvests.length}
        onPageChange={setPageNumber}
      />

    </div>
  )
}