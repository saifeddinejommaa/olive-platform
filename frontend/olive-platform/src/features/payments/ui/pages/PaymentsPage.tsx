import { useState } from 'react'
import DataTable from '../../../../common/widgets/tables/OrdersTable'

type Payment = {
  id: number
  paymentNumber: string
  paymentDate: string
  amount: number
  paymentMethod: string
  invoiceNumber: string | null
  supplierName: string | null
  workerName: string | null
  reference: string | null
}

const mockPayments: Payment[] = []

export default function PaymentsPage() {
  const [pageNumber, setPageNumber] = useState(1)

  const columns = [
    {
      key: 'paymentNumber' as keyof Payment,
      label: 'N° Paiement',
    },
    {
      key: 'paymentDate' as keyof Payment,
      label: 'Date',
    },
    {
      key: 'amount' as keyof Payment,
      label: 'Montant',
      render: (item: Payment) =>
        `${item.amount.toLocaleString()} €`,
    },
    {
      key: 'paymentMethod' as keyof Payment,
      label: 'Mode de paiement',
    },
    {
      key: 'invoiceNumber' as keyof Payment,
      label: 'Facture',
    },
    {
      key: 'supplierName' as keyof Payment,
      label: 'Fournisseur',
    },
    {
      key: 'workerName' as keyof Payment,
      label: 'Ouvrier',
    },
    {
      key: 'reference' as keyof Payment,
      label: 'Référence',
    },
  ]

  return (
    <div className="feature-page">

      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Paiements</h1>

          <p className="page-description">
            Suivi des paiements et règlements.
          </p>
        </div>
      </div>

      <div className="filters card">
        <input placeholder="N° paiement..." />

        <input placeholder="ID facture..." />

        <select defaultValue="">
          <option value="">Tous les modes</option>
          <option value="cash">Espèces</option>
          <option value="bank_transfer">Virement</option>
          <option value="check">Chèque</option>
          <option value="other">Autre</option>
        </select>

        <button className="secondary-button">
          Rechercher
        </button>
      </div>

      <DataTable
        data={mockPayments}
        columns={columns}
        pageNumber={pageNumber}
        pageSize={10}
        totalCount={mockPayments.length}
        onPageChange={setPageNumber}
      />

    </div>
  )
}