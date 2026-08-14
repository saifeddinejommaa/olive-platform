import { useState } from 'react'
import DataTable from '../../../../common/widgets/tables/OrdersTable'
import Button from '../../../../common/widgets/button/Button'
import TextInput from '../../../../common/widgets/textInput/TextInput'

type PressingOperation = {
  id: number
  pressingNumber: string
  pressingDate: string
  status: string
  oilQuantityLiters: number | null
  yieldPercentage: number | null
}

type PressingOperationFilters = {
  pressingNumber: string
  pressingDate: string
  harvestNumber: string
  purchaseNumber: string
}

const mockPressingOperations: PressingOperation[] = []

export default function PressingOperationsPage() {
  const [pageNumber, setPageNumber] = useState(1)

  const [filters, setFilters] =
    useState<PressingOperationFilters>({
      pressingNumber: '',
      pressingDate: '',
      harvestNumber: '',
      purchaseNumber: '',
    })

  const updateFilter = (
    field: keyof PressingOperationFilters,
    value: string
  ) => {
    setFilters((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleSearch = () => {
    const request = {
      pressingNumber:
        filters.pressingNumber || null,

      pressingDate:
        filters.pressingDate || null,

      harvestNumber:
        filters.harvestNumber || null,

      purchaseNumber:
        filters.purchaseNumber || null,
    }

    console.log(
      'Filtres envoyés au backend :',
      request
    )

    setPageNumber(1)

    // Appel API ici
  }

  const handleReset = () => {
    setFilters({
      pressingNumber: '',
      pressingDate: '',
      harvestNumber: '',
      purchaseNumber: '',
    })

    setPageNumber(1)
  }

  const columns = [
    {
      key: 'pressingNumber' as keyof PressingOperation,
      label: 'N° Pression',
    },
    {
      key: 'pressingDate' as keyof PressingOperation,
      label: 'Date',
    },
    {
      key: 'status' as keyof PressingOperation,
      label: 'Statut',
    },
    {
      key: 'oilQuantityLiters' as keyof PressingOperation,
      label: 'Huile produite',
      render: (item: PressingOperation) =>
        item.oilQuantityLiters !== null
          ? `${item.oilQuantityLiters.toLocaleString()} L`
          : '—',
    },
    {
      key: 'yieldPercentage' as keyof PressingOperation,
      label: 'Rendement',
      render: (item: PressingOperation) =>
        item.yieldPercentage !== null
          ? `${item.yieldPercentage}%`
          : '—',
    },
  ]

  return (
    <div className="feature-page">

      {/* HEADER */}

      <div className="page-header">
        <div className="page-header-content">

          <h1 className="page-title">
            Opérations de pression
          </h1>

          <p className="page-description">
            Gestion des opérations de pression des olives
            et de la production d’huile.
          </p>

        </div>
      </div>

      {/* FILTERS */}

      <div className="filters">

        <div className="filters-header">
          <div>
            <h3>Filtres de recherche</h3>

            <span>
              Rechercher une opération de pression
            </span>
          </div>
        </div>

        <div className="filters-content">

          {/* N° PRESSION */}

          <div className="filter-item">
            <TextInput
              label="N° Pression"
              placeholder="PRESS-2026-001"
              value={filters.pressingNumber}
              onChange={(event) =>
                updateFilter(
                  'pressingNumber',
                  event.target.value
                )
              }
            />
          </div>

          {/* DATE */}

          <div className="filter-item">
            <TextInput
              label="Date de pression"
              type="date"
              value={filters.pressingDate}
              onChange={(event) =>
                updateFilter(
                  'pressingDate',
                  event.target.value
                )
              }
            />
          </div>

          {/* N° RÉCOLTE */}

          <div className="filter-item">
            <TextInput
              label="N° Récolte"
              placeholder="HARV-2026-001"
              value={filters.harvestNumber}
              onChange={(event) =>
                updateFilter(
                  'harvestNumber',
                  event.target.value
                )
              }
            />
          </div>

          {/* N° ACHAT */}

          <div className="filter-item">
            <TextInput
              label="N° Achat"
              placeholder="ACH-2026-001"
              value={filters.purchaseNumber}
              onChange={(event) =>
                updateFilter(
                  'purchaseNumber',
                  event.target.value
                )
              }
            />
          </div>

        </div>

        {/* FOOTER */}

        <div className="filters-footer">

          <Button
            variant="secondary"
            onClick={handleReset}
          >
            Réinitialiser
          </Button>

          <Button
            variant="primary"
            onClick={handleSearch}
          >
            Rechercher
          </Button>

        </div>

      </div>

      {/* TABLE */}

      <DataTable
        data={mockPressingOperations}
        columns={columns}
        pageNumber={pageNumber}
        pageSize={10}
        totalCount={mockPressingOperations.length}
        onPageChange={setPageNumber}
      />

    </div>
  )
}