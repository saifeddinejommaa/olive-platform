import { useState } from 'react'
import DataTable from '../../../../common/widgets/tables/OrdersTable'

type OilMovement = {
  id: number
  movementNumber: string
  movementType: string
  movementDate: string
  oilBatchNumber: string | null
  sourceTankCode: string | null
  destinationTankCode: string | null
  quantityLiters: number
}

const mockOilMovements: OilMovement[] = []

export default function OilMovementsPage() {
  const [pageNumber, setPageNumber] = useState(1)

  const columns = [
    {
      key: 'movementNumber' as keyof OilMovement,
      label: 'N° Mouvement',
    },
    {
      key: 'movementType' as keyof OilMovement,
      label: 'Type',
    },
    {
      key: 'movementDate' as keyof OilMovement,
      label: 'Date',
    },
    {
      key: 'oilBatchNumber' as keyof OilMovement,
      label: 'Lot huile',
    },
    {
      key: 'sourceTankCode' as keyof OilMovement,
      label: 'Source',
    },
    {
      key: 'destinationTankCode' as keyof OilMovement,
      label: 'Destination',
    },
    {
      key: 'quantityLiters' as keyof OilMovement,
      label: 'Quantité',
      render: (item: OilMovement) =>
        `${item.quantityLiters.toLocaleString()} L`,
    },
  ]

  return (
    <div className="feature-page">

      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">
            Mouvements d’huile
          </h1>

          <p className="page-description">
            Entrées, transferts, sorties et ajustements de stock.
          </p>
        </div>
      </div>

      <div className="filters card">

        <input placeholder="N° mouvement..." />

        <select defaultValue="">
          <option value="">Tous les types</option>
          <option value="production_in">Production In</option>
          <option value="transfer_in">Transfer In</option>
          <option value="transfer_out">Transfer Out</option>
          <option value="sale_out">Sale Out</option>
          <option value="loss">Loss</option>
          <option value="adjustment">Adjustment</option>
        </select>

        <input placeholder="Lot huile..." />
        <input placeholder="Citerne..." />

        <button className="secondary-button">
          Rechercher
        </button>

      </div>

      <DataTable
        data={mockOilMovements}
        columns={columns}
        pageNumber={pageNumber}
        pageSize={10}
        totalCount={mockOilMovements.length}
        onPageChange={setPageNumber}
      />

    </div>
  )
}