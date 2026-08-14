import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../../../common/widgets/tables/OrdersTable'

type OlivePurchase = {
  id: number
  purchaseNumber: string
  supplierName: string
  purchaseDate: string
  status: string
  totalQuantityKg: number
  totalAmount: number
  itemsCount: number
}

const mockPurchases: OlivePurchase[] = []

export default function OlivePurchasesPage() {
  const navigate = useNavigate()

  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = 10

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
      render: (item: OlivePurchase) => (
        <span className="status-badge">
          {item.status}
        </span>
      ),
    },
    {
      key: 'totalQuantityKg' as keyof OlivePurchase,
      label: 'Quantité',
      render: (item: OlivePurchase) =>
        `${item.totalQuantityKg.toLocaleString()} kg`,
    },
    {
      key: 'totalAmount' as keyof OlivePurchase,
      label: 'Montant',
      render: (item: OlivePurchase) =>
        `${item.totalAmount.toLocaleString()} €`,
    },
    {
      key: 'itemsCount' as keyof OlivePurchase,
      label: 'Articles',
    },
  ]

  return (
    <div className="feature-page">

      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">
            Achats d’olives
          </h1>

          <p className="page-description">
            Gestion des achats d’olives auprès des fournisseurs.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => navigate('/olive-purchases/new')}
        >
          + Nouvel achat
        </button>
      </div>

      <div className="filters card">
        <input
          type="text"
          placeholder="N° achat..."
        />

        <input
          type="text"
          placeholder="Fournisseur..."
        />

        <select defaultValue="">
          <option value="">Tous les statuts</option>
          <option value="draft">Brouillon</option>
          <option value="pending">En attente</option>
          <option value="approved">Approuvé</option>
          <option value="received">Reçu</option>
          <option value="cancelled">Annulé</option>
        </select>

        <button className="secondary-button">
          Rechercher
        </button>
      </div>

      <DataTable
        data={mockPurchases}
        columns={columns}
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalCount={mockPurchases.length}
        onPageChange={setPageNumber}
        onRowClick={(item) =>
          navigate(`/olive-purchases/${item.id}`)
        }
      />

    </div>
  )
}