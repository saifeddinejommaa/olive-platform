import { useState } from 'react'
import DataTable from '../../../../common/widgets/tables/OrdersTable'

type ProductionBatch = {
  id: number
  batchNumber: string
  productionDate: string
  status: string
  oliveQuantityKg: number | null
  oilQuantityLiters: number | null
  yieldPercentage: number | null
}

const mockProductionBatches: ProductionBatch[] = []

export default function ProductionBatchesPage() {
  const [pageNumber, setPageNumber] = useState(1)

  const columns = [
    {
      key: 'batchNumber' as keyof ProductionBatch,
      label: 'N° Production',
    },
    {
      key: 'productionDate' as keyof ProductionBatch,
      label: 'Date',
    },
    {
      key: 'status' as keyof ProductionBatch,
      label: 'Statut',
    },
    {
      key: 'oliveQuantityKg' as keyof ProductionBatch,
      label: 'Olives',
      render: (item: ProductionBatch) =>
        item.oliveQuantityKg !== null
          ? `${item.oliveQuantityKg.toLocaleString()} kg`
          : '—',
    },
    {
      key: 'oilQuantityLiters' as keyof ProductionBatch,
      label: 'Huile',
      render: (item: ProductionBatch) =>
        item.oilQuantityLiters !== null
          ? `${item.oilQuantityLiters.toLocaleString()} L`
          : '—',
    },
    {
      key: 'yieldPercentage' as keyof ProductionBatch,
      label: 'Rendement',
      render: (item: ProductionBatch) =>
        item.yieldPercentage !== null
          ? `${item.yieldPercentage}%`
          : '—',
    },
  ]

  return (
    <div className="feature-page">

      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">
            Production
          </h1>

          <p className="page-description">
            Suivi des campagnes de production d’huile.
          </p>
        </div>
      </div>

      <div className="filters card">
        <input placeholder="N° production..." />

        <select defaultValue="">
          <option value="">Tous les statuts</option>
          <option value="planned">Planifiée</option>
          <option value="in_progress">En cours</option>
          <option value="completed">Terminée</option>
          <option value="cancelled">Annulée</option>
        </select>

        <button className="secondary-button">
          Rechercher
        </button>
      </div>

      <DataTable
        data={mockProductionBatches}
        columns={columns}
        pageNumber={pageNumber}
        pageSize={10}
        totalCount={mockProductionBatches.length}
        onPageChange={setPageNumber}
      />

    </div>
  )
}