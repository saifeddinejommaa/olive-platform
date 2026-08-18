import { useEffect } from 'react'
import DataTable from '../../../../common/widgets/tables/OrdersTable'
import Button from '../../../../common/widgets/button/Button'
import TextInput from '../../../../common/widgets/textInput/TextInput'
import { usePressingOperationsStore } from '../stores/pressingOperationStore'

type PressingOperation = {
  id: number
  operationNumber: string
  pressingDate: string
  status: string
  oilQuantityLiters: number | null
  yieldPercentage: number | null
}

type PressingOperationFilters = {
  operationNumber: string
  pressingDate: string
  harvestNumber: string
  purchaseNumber: string
} 

export default function PressingOperationsPage() {

  const {
    PressingOperations,
    filters,
    loading,
    setFilter,
    fetcPressingOperations,
  } = usePressingOperationsStore()

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    fetcPressingOperations()
  }, [])

  // ============================================================
  // FILTER
  // ============================================================

  const updateFilter = (
    field: keyof PressingOperationFilters,
    value: string
  ) => {
    setFilter(field, value)
  }

  // ============================================================
  // SEARCH
  // ============================================================

  const handleSearch = async () => {
    console.log('Searching pressing operations with filters:', filters)
    await fetcPressingOperations()
  }

  // ============================================================
  // RESET
  // ============================================================

  const handleReset = async () => {
    setFilter('pressingNumber', '')
    setFilter('pressingDate', '')
    setFilter('harvestNumber', '')
    setFilter('purchaseNumber', '')

    await fetcPressingOperations()
  }

  // ============================================================
  // PAGINATION
  // ============================================================

  const handlePageChange = async (pageNumber: number) => {
    setFilter('pageNumber', pageNumber)
    await fetcPressingOperations()
  }

  // ============================================================
  // COLUMNS
  // ============================================================

  const columns = [
    {
      key: 'operationNumber' as keyof PressingOperation,
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
              value={filters.operationNumber}
              onChange={(event) =>
                updateFilter(
                  'operationNumber',
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
            {loading
              ? 'Recherche...'
              : 'Rechercher'}
          </Button>

        </div>

      </div>

      {/* TABLE */}

      <DataTable
        data={PressingOperations?.items ?? []}
        columns={columns}
        pageNumber={PressingOperations?.pageNumber ?? 1}
        pageSize={PressingOperations?.pageSize ?? 10}
        totalCount={PressingOperations?.totalCount ?? 0}
        onPageChange={handlePageChange}
      />

    </div>
  )
}