import { useEffect } from 'react'

import DataTable from '../../../../common/widgets/tables/OrdersTable'
import Button from '../../../../common/widgets/button/Button'
import TextInput from '../../../../common/widgets/textInput/TextInput'
import Select from '../../../../common/widgets/select/Select'

import type { Harvest } from '../../domain/entities/Harvest'
import type { HarvestFilters } from '../../domain/entities/HarvestsFilters'

import { useHarvestsStore } from '../stores/HarvestsStore'

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

  /**
   * Chargement initial
   */
  useEffect(() => {
    fetchHarvests()
  }, [])

  /**
   * Modification d'un filtre
   */
  const updateFilter = (
    field: keyof HarvestFilters,
    value: string | number | null
  ) => {
    setFilter(field, value)
  }

  /**
   * Recherche
   */
  const handleSearch = async () => {

    setFilter('pageNumber', 1)

    await fetchHarvests()
  }

  /**
   * Réinitialisation
   */
  const handleReset = async () => {
    clearFilters()

    await fetchHarvests()
  }

  /**
   * Pagination
   */
  const handlePageChange = async (page: number) => {

    setFilter('pageNumber', page)

    await fetchHarvests()
  }

  /**
   * Colonnes
   */
  const columns = [
    {
      key: 'harvestNumber' as keyof Harvest,
      label: 'N° Récolte',
    },

    {
      key: 'plotId' as keyof Harvest,
      label: 'Parcelle',
      render: (item: Harvest) =>
        item.plotId ?? '-',
    },

    {
      key: 'harvestDate' as keyof Harvest,
      label: 'Date',
      render: (item: Harvest) =>
        item.harvestDate
          ? new Date(
              item.harvestDate
            ).toLocaleDateString('fr-FR')
          : '-',
    },

    {
      key: 'qualityGrade' as keyof Harvest,
      label: 'Qualité',
      render: (item: Harvest) =>
        item.qualityGrade ?? '-',
    },

    {
      key: 'quantityKg' as keyof Harvest,
      label: 'Quantité',
      render: (item: Harvest) =>
        `${item.quantityKg.toLocaleString(
          'fr-FR'
        )} kg`,
    },
  ]

  return (
    <div className="feature-page">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="page-header">
        <div className="page-header-content">

          <h1 className="page-title">
            Récoltes
          </h1>

          <p className="page-description">
            Gestion des récoltes d’olives et suivi de
            leur qualité.
          </p>

        </div>
      </div>


      {/* =====================================================
          FILTERS
          ===================================================== */}

      <div className="filters">

        <div className="filters-header">
          <div>

            <h3>
              Filtres de recherche
            </h3>

            <span>
              Rechercher une récolte
            </span>

          </div>
        </div>


        <div className="filters-content">

          {/* N° RÉCOLTE */}

          <div className="filter-item">

            <TextInput
              label="N° Récolte"
              placeholder="REC-2026-001"
              value={
                filters.harvestNumber
              }
              onChange={(event) =>
                updateFilter(
                  'harvestNumber',
                  event.target.value
                )
              }
            />

          </div>


          {/* PARCELLE */}

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
              onChange={(event) =>
                updateFilter(
                  'plotId',
                  event.target.value
                    ? Number(event.target.value)
                    : null
                )
              }
            />

          </div>


          {/* DATE DEBUT */}

          <div className="filter-item">

            <TextInput
              label="Du"
              type="date"
              value={
                filters.fromDate
              }
              onChange={(event) =>
                updateFilter(
                  'fromDate',
                  event.target.value
                )
              }
            />

          </div>


          {/* DATE FIN */}

          <div className="filter-item">

            <TextInput
              label="Au"
              type="date"
              value={
                filters.toDate
              }
              onChange={(event) =>
                updateFilter(
                  'toDate',
                  event.target.value
                )
              }
            />

          </div>


          {/* QUALITÉ */}

          <div className="filter-item">

            <Select
              label="Qualité"
              value={
                filters.qualityGrade
              }
              onChange={(event) =>
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


        {/* =====================================================
            FOOTER
            ===================================================== */}

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
            {loading
              ? 'Recherche...'
              : 'Rechercher'}
          </Button>

        </div>

      </div>


      {/* =====================================================
          ERROR
          ===================================================== */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {/* =====================================================
          TABLE
          ===================================================== */}

      <DataTable
        data={harvests.items}
        columns={columns}
        pageNumber={
          harvests.pageNumber
        }
        pageSize={
          harvests.pageSize
        }
        totalCount={
          harvests.totalCount
        }
        onPageChange={
          handlePageChange
        }
      />


      {/* =====================================================
          LOADING
          ===================================================== */}

      {loading && (
        <div className="loading">
          Chargement des récoltes...
        </div>
      )}

    </div>
  )
}