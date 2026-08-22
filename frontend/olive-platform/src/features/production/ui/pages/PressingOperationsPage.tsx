import { useEffect } from 'react'
import DataTable from '../../../../common/widgets/tables/OrdersTable'
import Button from '../../../../common/widgets/button/Button'
import TextInput from '../../../../common/widgets/textInput/TextInput'
import { usePressingOperationsStore } from '../stores/pressingOperationStore'
import type { PressingOperation } from '../../domain/entities/PressingOperation'
import type { PressingOperationFilters } from '../../domain/entities/PressingOperationFilters'
import { formatDateTime } from '../../../shared/utils/DatesUtils'
import { productionStatusConfig } from '../../../shared/status/ProductionStatusConfig'
import { renderStatus } from '../../../shared/utils/StatusUtils'
import EditIcon from '@mui/icons-material/Edit';

export default function PressingOperationsPage() {
  const { PressingOperations, filters, loading, setFilter, fetchPressingOperations } = usePressingOperationsStore()

  useEffect(() => {
    fetchPressingOperations()
  }, [])

  const updateFilter = (field: keyof PressingOperationFilters, value: string) => {
    setFilter(field, value)
  }

  const handleSearch = async () => {
    await fetchPressingOperations()
  }

  const handleReset = async () => {
    setFilter('pressingNumber', '')
    setFilter('pressingDate', '')
    setFilter('harvestNumber', '')
    setFilter('purchaseNumber', '')
    await fetchPressingOperations()
  }

  const handlePageChange = async (pageNumber: number) => {
    setFilter('pageNumber', pageNumber)
    await fetchPressingOperations()
  }

  const handleOpenDetails = (id: number) => {
    window.open(`/production/pressing-operations/${id}`, '_blank', 'noopener,noreferrer')
  }

  const columns = [
    {
      key: 'operationNumber' as keyof PressingOperation,
      label: 'N° Pression',
    },
    {
      key: 'createdAt' as keyof PressingOperation,
      label: 'Date',
      render: (item: PressingOperation) => formatDateTime(item.createdAt),
    },
    {
      key: 'status' as keyof PressingOperation,
      label: 'Statut',
      render: (item: PressingOperation) => renderStatus(item.status, productionStatusConfig),
    },
    {
      key: 'oilQuantityLiters' as keyof PressingOperation,
      label: 'Huile produite',
      render: (item: PressingOperation) =>
        item.oilQuantityLiters !== null ? `${item.oilQuantityLiters.toLocaleString()} L` : '—',
    },
    {
      key: 'id' as keyof PressingOperation,
      label: 'Actions',
      render: (item: PressingOperation) => (
        <button
          type="button"
          title="Modifier l'opération"
          aria-label="Modifier l'opération"
          onClick={() => handleOpenDetails(item.id)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
          }}
        >
          <EditIcon fontSize="small" sx={{ color: 'var(--color-olive-900)' }} />
        </button>
      ),
    },
  ]

  return (
    <div className="feature-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Opérations de pression</h1>
          <p className="page-description">Gestion des opérations de pression des olives et de la production d’huile.</p>
        </div>
      </div>

      <div className="filters">
        <div className="filters-header">
          <div>
            <h3>Filtres de recherche</h3>
            <span>Rechercher une opération de pression</span>
          </div>
        </div>

        <div className="filters-content">
          <div className="filter-item">
            <TextInput label="N° Pression" placeholder="PRESS-2026-001" value={filters.operationNumber} onChange={event => updateFilter('operationNumber', event.target.value)} />
          </div>

          <div className="filter-item">
            <TextInput label="Date de pression" type="date" value={filters.pressingDate} onChange={event => updateFilter('pressingDate', event.target.value)} />
          </div>

          <div className="filter-item">
            <TextInput label="N° Récolte" placeholder="HARV-2026-001" value={filters.harvestNumber} onChange={event => updateFilter('harvestNumber', event.target.value)} />
          </div>

          <div className="filter-item">
            <TextInput label="N° Achat" placeholder="ACH-2026-001" value={filters.purchaseNumber} onChange={event => updateFilter('purchaseNumber', event.target.value)} />
          </div>
        </div>

        <div className="filters-footer">
          <Button variant="secondary" onClick={handleReset}>
            Réinitialiser
          </Button>
          <Button variant="primary" onClick={handleSearch}>
            {loading ? 'Recherche...' : 'Rechercher'}
          </Button>
        </div>
      </div>

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