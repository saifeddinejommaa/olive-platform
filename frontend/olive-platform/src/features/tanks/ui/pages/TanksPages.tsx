import { useState } from 'react'
import DataTable from '../../../../common/widgets/tables/OrdersTable'

type Tank = {
  id: number
  code: string
  name: string | null
  capacityLiters: number
  location: string | null
  tankType: string | null
  status: string
}

const mockTanks: Tank[] = []

export default function TanksPage() {
  const [pageNumber, setPageNumber] = useState(1)

  const columns = [
    {
      key: 'code' as keyof Tank,
      label: 'Code',
    },
    {
      key: 'name' as keyof Tank,
      label: 'Nom',
    },
    {
      key: 'capacityLiters' as keyof Tank,
      label: 'Capacité',
      render: (item: Tank) =>
        `${item.capacityLiters.toLocaleString()} L`,
    },
    {
      key: 'location' as keyof Tank,
      label: 'Emplacement',
    },
    {
      key: 'tankType' as keyof Tank,
      label: 'Type',
    },
    {
      key: 'status' as keyof Tank,
      label: 'Statut',
    },
  ]

  return (
    <div className="feature-page">

      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">
            Citernes
          </h1>

          <p className="page-description">
            Gestion des citernes et du stockage d’huile.
          </p>
        </div>
      </div>

      <div className="filters card">
        <input placeholder="Code..." />
        <input placeholder="Nom..." />
        <input placeholder="Emplacement..." />
        <input placeholder="Type..." />

        <select defaultValue="">
          <option value="">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>

        <button className="secondary-button">
          Rechercher
        </button>
      </div>

      <DataTable
        data={mockTanks}
        columns={columns}
        pageNumber={pageNumber}
        pageSize={10}
        totalCount={mockTanks.length}
        onPageChange={setPageNumber}
      />

    </div>
  )
}