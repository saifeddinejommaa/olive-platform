import { useEffect } from 'react'
import DataTable from '../../../../common/widgets/tables/OrdersTable'
import Button from '../../../../common/widgets/button/Button'
import TextInput from '../../../../common/widgets/textInput/TextInput'
import Select from '../../../../common/widgets/select/Select'

import type { OlivePurchase } from '../../domain/entities/OlivePurchase'
import type { OlivePurchasesFilter } from '../../domain/entities/OlivePurchaseFilter'

import { useOlivePurchasesStore } from '../stores/OlivePurchaseStore'
import { useConstantsStore } from '../../../appConstants/ConstantsStore'

export default function OlivePurchasesPage() {
  const {
    olivePurchases,
    loading,
    error,
    filters,
    setFilter,
    clearFilters,
    fetchOlivePurchases,
  } = useOlivePurchasesStore()

  const {
    Appconstants,
    loading: constantsLoading,
    fetchConstants,
  } = useConstantsStore()

  /**
   * Chargement des constantes
   */
  useEffect(() => {
    fetchConstants()
  }, [fetchConstants])

  /**
   * Chargement initial des achats
   */
  useEffect(() => {
    fetchOlivePurchases()
  }, [fetchOlivePurchases])

  /**
   * Modification d'un filtre
   */
  const updateFilter = (
    field: keyof OlivePurchasesFilter,
    value: string | number
  ) => {
    setFilter(field, value)
  }

  /**
   * Recherche
   */
  const handleSearch = async () => {
    setFilter('pageNumber', 1)

    await fetchOlivePurchases()
  }

  /**
   * Réinitialisation des filtres
   */
  const handleReset = async () => {
    clearFilters()

    await fetchOlivePurchases()
  }

  /**
   * Pagination
   */
  const handlePageChange = async (page: number) => {
    setFilter('pageNumber', page)

    await fetchOlivePurchases()
  }

  /**
   * Options des statuts
   */
  const statusOptions = [
    {
      value: '',
      label: 'Tous les statuts',
    },

    ...Appconstants.purchaseStatuses.map((status) => ({
      value: String(status.id),
      label: status.label,
    })),
  ]

  const columns = [
    {
      key: 'purchaseNumber' as keyof OlivePurchase,
      label: 'N° Achat',
    },

    {
      key: 'supplierName' as keyof OlivePurchase,
      label: 'Fournisseur',
    },

    {
      key: 'purchaseDate' as keyof OlivePurchase,
      label: 'Date',
      render: (item: OlivePurchase) =>
        new Date(item.purchaseDate).toLocaleDateString(
          'fr-FR'
        ),
    },

    {
      key: 'status' as keyof OlivePurchase,
      label: 'Statut',
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
            Achats d’olives
          </h1>

          <p className="page-description">
            Gestion des achats d’olives auprès des
            fournisseurs.
          </p>

        </div>
      </div>


      {/* =====================================================
          FILTERS
          ===================================================== */}

      <div className="filters">

        <div className="filters-header">
          <div>
            <h3>Filtres de recherche</h3>

            <span>
              Rechercher un achat d’olives
            </span>
          </div>
        </div>


        <div className="filters-content">

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


          {/* FOURNISSEUR */}

          <div className="filter-item">
            <TextInput
              label="Fournisseur"
              placeholder="Nom du fournisseur"
              value={filters.supplierName}
              onChange={(event) =>
                updateFilter(
                  'supplierName',
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


          {/* STATUT */}

          <div className="filter-item">
            <Select
              label="Statut"
              value={filters.status}
              onChange={(event) =>
                updateFilter(
                  'status',
                  event.target.value
                )
              }
              options={statusOptions}
            />
          </div>

        </div>


        {/* =====================================================
            FILTER FOOTER
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
            disabled={
              loading || constantsLoading
            }
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
        data={olivePurchases.items}
        columns={columns}
        pageNumber={olivePurchases.pageNumber}
        pageSize={olivePurchases.pageSize}
        totalCount={olivePurchases.totalCount}
        onPageChange={handlePageChange}
      />


      {/* =====================================================
          LOADING
          ===================================================== */}

      {(loading || constantsLoading) && (
        <div className="loading">
          {constantsLoading
            ? 'Chargement des constantes...'
            : 'Chargement des achats d’olives...'}
        </div>
      )}

    </div>
  )
}