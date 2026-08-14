import { useState } from 'react'
import DataTable from '../../../../common/widgets/tables/OrdersTable'
import Button from '../../../../common/widgets/button/Button'
import TextInput from '../../../../common/widgets/textInput/TextInput'
import Select from '../../../../common/widgets/select/Select'

type Harvest = {
  id: number
  harvestNumber: string
  plotId: number | null
  harvestDate: string
  qualityGrade: string | null
  quantityKg: number
}

type HarvestFilters = {
  harvestNumber: string
  plotId: string
  fromDate: string
  toDate: string
  qualityGrade: string
}

const mockHarvests: Harvest[] = []

export default function HarvestsPage() {
  const [pageNumber, setPageNumber] = useState(1)

  const [filters, setFilters] = useState<HarvestFilters>({
    harvestNumber: '',
    plotId: '',
    fromDate: '',
    toDate: '',
    qualityGrade: '',
  })

  const updateFilter = (
    field: keyof HarvestFilters,
    value: string
  ) => {
    setFilters((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleSearch = () => {
    const request = {
      harvestNumber: filters.harvestNumber || null,
      plotId: filters.plotId
        ? Number(filters.plotId)
        : null,
      fromDate: filters.fromDate || null,
      toDate: filters.toDate || null,
      qualityGrade: filters.qualityGrade || null,
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
      harvestNumber: '',
      plotId: '',
      fromDate: '',
      toDate: '',
      qualityGrade: '',
    })

    setPageNumber(1)
  }

  const columns = [
    {
      key: 'harvestNumber' as keyof Harvest,
      label: 'N° Récolte',
    },
    {
      key: 'plotId' as keyof Harvest,
      label: 'Parcelle',
    },
    {
      key: 'harvestDate' as keyof Harvest,
      label: 'Date',
    },
    {
      key: 'qualityGrade' as keyof Harvest,
      label: 'Qualité',
    },
    {
      key: 'quantityKg' as keyof Harvest,
      label: 'Quantité',
      render: (item: Harvest) =>
        `${item.quantityKg.toLocaleString()} kg`,
    },
  ]

  return (
    <div className="feature-page">

      {/* HEADER */}

      <div className="page-header">
        <div className="page-header-content">

          <h1 className="page-title">
            Récoltes
          </h1>

          <p className="page-description">
            Gestion des récoltes d’olives et suivi de leur qualité.
          </p>

        </div>
      </div>


      {/* FILTERS */}

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
              value={filters.harvestNumber}
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
              value={filters.plotId}
              onChange={(event) =>
                updateFilter(
                  'plotId',
                  event.target.value
                )
              }
            />

          </div>


          {/* DATE DEBUT */}

          <div className="filter-item">

            <TextInput
              label="Du"
              type="date"
              value={filters.fromDate}
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
              value={filters.toDate}
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
              value={filters.qualityGrade}
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