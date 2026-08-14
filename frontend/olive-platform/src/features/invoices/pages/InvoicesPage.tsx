import { useState } from 'react'
import TextInput from '../../../common/widgets/textInput/TextInput'
import Select from '../../../common/widgets/select/Select'
import Button from '../../../common/widgets/button/Button'
import DataTable from '../../../common/widgets/tables/OrdersTable'

type Invoice = {
  id: number
  invoiceNumber: string
  invoiceType: string
  supplierName: string | null
  customerName: string | null
  status: string
  invoiceDate: string
  totalAmount: number
}

type InvoiceFilters = {
  invoiceNumber: string
  invoiceType: string
  supplierName: string
  customerName: string
  status: string
  fromDate: string
  toDate: string
}

const mockInvoices: Invoice[] = []

export default function InvoicesPage() {
  const [pageNumber, setPageNumber] = useState(1)

  const [filters, setFilters] =
    useState<InvoiceFilters>({
      invoiceNumber: '',
      invoiceType: '',
      supplierName: '',
      customerName: '',
      status: '',
      fromDate: '',
      toDate: '',
    })

  const updateFilter = (
    field: keyof InvoiceFilters,
    value: string
  ) => {
    setFilters((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleSearch = () => {
    const request = {
      invoiceNumber:
        filters.invoiceNumber || null,

      invoiceType:
        filters.invoiceType || null,

      supplierName:
        filters.supplierName || null,

      customerName:
        filters.customerName || null,

      status:
        filters.status || null,

      fromDate:
        filters.fromDate || null,

      toDate:
        filters.toDate || null,
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
      invoiceNumber: '',
      invoiceType: '',
      supplierName: '',
      customerName: '',
      status: '',
      fromDate: '',
      toDate: '',
    })

    setPageNumber(1)
  }

  const columns = [
    {
      key: 'invoiceNumber' as keyof Invoice,
      label: 'N° Facture',
    },
    {
      key: 'invoiceType' as keyof Invoice,
      label: 'Type',
    },
    {
      key: 'supplierName' as keyof Invoice,
      label: 'Fournisseur',
    },
    {
      key: 'customerName' as keyof Invoice,
      label: 'Client',
    },
    {
      key: 'invoiceDate' as keyof Invoice,
      label: 'Date',
    },
    {
      key: 'status' as keyof Invoice,
      label: 'Statut',
    },
    {
      key: 'totalAmount' as keyof Invoice,
      label: 'Montant',
      render: (item: Invoice) =>
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
            Factures
          </h1>

          <p className="page-description">
            Gestion des factures fournisseurs et clients.
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
              Rechercher une facture
            </span>

          </div>

        </div>


        <div className="filters-content">

          {/* N° FACTURE */}

          <div className="filter-item">

            <TextInput
              label="N° Facture"
              placeholder="FAC-2026-001"
              value={filters.invoiceNumber}
              onChange={(event) =>
                updateFilter(
                  'invoiceNumber',
                  event.target.value
                )
              }
            />

          </div>


          {/* TYPE */}

          <div className="filter-item">

            <Select
              label="Type"
              value={filters.invoiceType}
              onChange={(event) =>
                updateFilter(
                  'invoiceType',
                  event.target.value
                )
              }
              options={[
                {
                  value: '',
                  label: 'Tous les types',
                },
                {
                  value: 'supplier',
                  label: 'Fournisseur',
                },
                {
                  value: 'customer',
                  label: 'Client',
                },
              ]}
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


          {/* CLIENT */}

          <div className="filter-item">

            <TextInput
              label="Client"
              placeholder="Nom du client"
              value={filters.customerName}
              onChange={(event) =>
                updateFilter(
                  'customerName',
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
                  value: 'paid',
                  label: 'Payée',
                },
                {
                  value: 'cancelled',
                  label: 'Annulée',
                },
              ]}
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

        </div>


        {/* ===================================================
            ACTIONS
            =================================================== */}

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
        data={mockInvoices}
        columns={columns}
        pageNumber={pageNumber}
        pageSize={10}
        totalCount={mockInvoices.length}
        onPageChange={setPageNumber}
      />

    </div>
  )
}