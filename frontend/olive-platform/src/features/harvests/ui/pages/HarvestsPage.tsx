import { useEffect } from 'react'
import DataTable from '../../../../common/widgets/tables/OrdersTable'
import Button from '../../../../common/widgets/button/Button'
import TextInput from '../../../../common/widgets/textInput/TextInput'
import Select from '../../../../common/widgets/select/Select'
import type { Harvest } from '../../domain/entities/Harvest'
import type { HarvestFilters } from '../../domain/entities/HarvestsFilters'
import { useHarvestsStore } from '../stores/HarvestsStore'
import { useConstantsStore } from '../../../appConstants/ConstantsStore'
import { getOliveVarietyLabel } from '../../../appConstants/helper/AppConstantsHelper'
import { renderStatus } from '../../../shared/utils/StatusUtils'
import { productionStatusConfig } from '../../../shared/status/ProductionStatusConfig'
import EditIcon from '@mui/icons-material/Edit';

export default function HarvestsPage() {
  const {
    harvests,
    loading,
    error,
    filters,
    setFilter,
    clearFilters,
    fetchHarvests,
  } = useHarvestsStore()

  const {
    fetchConstants,
  } = useConstantsStore()

  useEffect(() => {
    fetchConstants()
    fetchHarvests()
  }, [])

  const updateFilter = (
    field: keyof HarvestFilters,
    value: string | number | null
  ) => {
    setFilter(field, value)
  }

  const handleSearch = async () => {
    setFilter('pageNumber', 1)
    await fetchHarvests()
  }

  const handleReset = async () => {
    clearFilters()
    await fetchHarvests()
  }

  const handlePageChange = async (page: number) => {
    setFilter('pageNumber', page)
    await fetchHarvests()
  }

  const handleOpenDetails = (id: number) => {
    window.open(`/harvests/harvest-operation/${id}`, '_blank', 'noopener,noreferrer')
  }


  const columns = [
    {
      key: 'reference' as keyof Harvest,
      label: 'Référence',
      render: (item: Harvest) => item.reference || '-',
    },
    {
      key: 'harvestDate' as keyof Harvest,
      label: 'Date',
      render: (item: Harvest) =>
        item.harvestDate
          ? new Date(item.harvestDate).toLocaleDateString('fr-FR')
          : '-',
    },
    {
      key: 'plannedTrees' as keyof Harvest,
      label: 'Arbres planifiés',
      render: (item: Harvest) =>
        item.plannedTrees?.toLocaleString('fr-FR') ?? '0',
    },
    {
      key: 'harvestedTrees' as keyof Harvest,
      label: 'Arbres récoltés',
      render: (item: Harvest) =>
        item.harvestedTrees?.toLocaleString('fr-FR') ?? '0',
    },
    {
      key: 'varietyId' as keyof Harvest,
      label: 'Variété',
      render: (item: Harvest) =>
        getOliveVarietyLabel(item.variety),
    },
    {
      key: 'status' as keyof Harvest,
      label: 'Statut',
      render: (item: Harvest) =>
        renderStatus(item.status,productionStatusConfig),
    },

    {
      key: 'id' as keyof Harvest,
      label: 'Actions',
      render: (item: Harvest) => (
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
          <h1 className="page-title">Récoltes</h1>
          <p className="page-description">
            Gestion des récoltes d’olives et suivi de leur qualité.
          </p>
        </div>
      </div>

      <div className="filters">
        <div className="filters-header">
          <div>
            <h3>Filtres de recherche</h3>
            <span>Rechercher une récolte</span>
          </div>
        </div>

        <div className="filters-content">
          <div className="filter-item">
            <TextInput
              label="N° Récolte"
              placeholder="REC-2026-001"
              value={filters.harvestNumber}
              onChange={event =>
                updateFilter('harvestNumber', event.target.value)
              }
            />
          </div>

          <div className="filter-item">
            <TextInput
              label="Parcelle"
              placeholder="ID parcelle"
              type="number"
              value={
                filters.plotId !== null
                  ? String(filters.plotId)
                  : ''
              }
              onChange={event =>
                updateFilter(
                  'plotId',
                  event.target.value
                    ? Number(event.target.value)
                    : null
                )
              }
            />
          </div>

          <div className="filter-item">
            <TextInput
              label="Du"
              type="date"
              value={filters.fromDate}
              onChange={event =>
                updateFilter('fromDate', event.target.value)
              }
            />
          </div>

          <div className="filter-item">
            <TextInput
              label="Au"
              type="date"
              value={filters.toDate}
              onChange={event =>
                updateFilter('toDate', event.target.value)
              }
            />
          </div>

          <div className="filter-item">
            <Select
              label="Qualité"
              value={filters.qualityGrade}
              onChange={event =>
                updateFilter(
                  'qualityGrade',
                  event.target.value
                )
              }
              options={[
                {
                  value: '',
                  label: 'Toutes les qualités',
                },
                {
                  value: 'A',
                  label: 'Qualité A',
                },
                {
                  value: 'B',
                  label: 'Qualité B',
                },
                {
                  value: 'C',
                  label: 'Qualité C',
                },
              ]}
            />
          </div>
        </div>

        <div className="filters-footer">
          <Button
            variant="secondary"
            onClick={handleReset}
            disabled={loading}
          >
            Réinitialiser
          </Button>

          <Button
            variant="primary"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? 'Recherche...' : 'Rechercher'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <DataTable
        data={harvests.items}
        columns={columns}
        pageNumber={harvests.pageNumber}
        pageSize={harvests.pageSize}
        totalCount={harvests.totalCount}
        onPageChange={handlePageChange}
      />

      {loading && (
        <div className="loading">
          Chargement des récoltes...
        </div>
      )}
    </div>
  )
}