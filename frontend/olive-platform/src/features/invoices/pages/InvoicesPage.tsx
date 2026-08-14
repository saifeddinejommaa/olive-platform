import { useState } from 'react'
import DataTable from '../../../common/widgets/tables/OrdersTable'


type Invoice = {
  id: number
  invoiceNumber: string
  invoiceType: string
  supplierName: string | null
  customerName: string | null
  invoiceDate: string
  dueDate: string | null
  totalAmount: number
  status: string
}

const mockInvoices: Invoice[] = []

export default function InvoicesPage() {
  const [pageNumber, setPageNumber] = useState(1)

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
      key: 'dueDate' as keyof Invoice,
      label: 'Échéance',
    },
    {
      key: 'totalAmount' as keyof Invoice,
      label: 'Montant',
      render: (item: Invoice) =>
        `${item.totalAmount.toLocaleString()} €`,
    },
    {
      key: 'status' as keyof Invoice,
      label: 'Statut',
    },
  ]

  return (
    <div className="feature-page">

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

      <div className="filters card">

        <input placeholder="N° facture..." />

        <select defaultValue="">
          <option value="">Tous les types</option>
          <option value="purchase">Achat</option>
          <option value="sale">Vente</option>
        </select>

        <select defaultValue="">
          <option value="">Tous les statuts</option>
          <option value="draft">Brouillon</option>
          <option value="issued">Émise</option>
          <option value="partially_paid">Partiellement payée</option>
          <option value="paid">Payée</option>
          <option value="cancelled">Annulée</option>
        </select>

        <button className="secondary-button">
          Rechercher
        </button>

      </div>

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