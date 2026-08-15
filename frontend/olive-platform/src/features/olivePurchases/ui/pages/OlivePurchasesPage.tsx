import { useState } from 'react'
import DataTable from '../../../../common/widgets/tables/OrdersTable'
import Button from '../../../../common/widgets/button/Button'
import TextInput from '../../../../common/widgets/textInput/TextInput'
import Select from '../../../../common/widgets/select/Select'

type OlivePurchase = {
  id: number
  purchaseNumber: string
  supplierName: string
  purchaseDate: string
  status: string
  quantityKg: number
  pricePerKg: number
  totalAmount: number
}

type OlivePurchaseFilters = {
  purchaseNumber: string
  supplierName: string
  fromDate: string
  toDate: string
  status: string
}

const mockOlivePurchases: OlivePurchase[] = []

export default function OlivePurchasesPage() {
  const [pageNumber, setPageNumber] = useState(1)

  const [filters, setFilters] = useState<OlivePurchaseFilters>({
    purchaseNumber: '',
    supplierName: '',
    fromDate: '',
    toDate: '',
    status: '',
  })

  const updateFilter = (
    field: keyof OlivePurchaseFilters,
    value: string
  ) => {
    setFilters((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleSearch = () => {

    setPageNumber(1)

    // Ici tu feras ton appel API
  }

  const handleReset = () => {
    setFilters({
      purchaseNumber: '',
      supplierName: '',
      fromDate: '',
      toDate: '',
      status: '',
    })

    setPageNumber(1)
  }

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
    },
    {
      key: 'status' as keyof OlivePurchase,
      label: 'Statut',
    },
    {
      key: 'quantityKg' as keyof OlivePurchase,
      label: 'Quantité',
      render: (item: OlivePurchase) =>
        `${item.quantityKg.toLocaleString()} kg`,
    },
    {
      key: 'pricePerKg' as keyof OlivePurchase,
      label: 'Prix / kg',
      render: (item: OlivePurchase) =>
        `${item.pricePerKg.toLocaleString()} €`,
    },
    {
      key: 'totalAmount' as keyof OlivePurchase,
      label: 'Montant total',
      render: (item: OlivePurchase) =>
        `${item.totalAmount.toLocaleString()} €`,
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
            Gestion des achats d’olives auprès des fournisseurs.
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
        options={[
          {
            value: '',
            label: 'Tous les statuts',
          },
          {
            value: 'draft',
            label: 'Brouillon',
          },
          {
            value: 'pending',
            label: 'En attente',
          },
          {
            value: 'approved',
            label: 'Approuvé',
          },
          {
            value: 'received',
            label: 'Reçu',
          },
          {
            value: 'cancelled',
            label: 'Annulé',
          },
        ]}
      />
    </div>

  </div>

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


      {/* =====================================================
          TABLE
          ===================================================== */}

      <DataTable
        data={mockOlivePurchases}
        columns={columns}
        pageNumber={pageNumber}
        pageSize={10}
        totalCount={mockOlivePurchases.length}
        onPageChange={setPageNumber}
      />

    </div>
  )
}