import { useState } from 'react'
import DataTable from '../../../../common/widgets/tables/OrdersTable'
import Button from '../../../../common/widgets/button/Button'
import TextInput from '../../../../common/widgets/textInput/TextInput'
import Select from '../../../../common/widgets/select/Select'

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

      <div className="filters">

        <TextInput
          placeholder="Code..."
        />

        <TextInput
          placeholder="Nom..."
        />

        <TextInput
          placeholder="Emplacement..."
        />

        <TextInput
          placeholder="Type..."
        />

        <Select
          defaultValue=""
          options={[
            {
              value: '',
              label: 'Tous les statuts',
            },
            {
              value: 'active',
              label: 'Actif',
            },
            {
              value: 'inactive',
              label: 'Inactif',
            },
          ]}
        />

        <Button variant="secondary">
          Rechercher
        </Button>

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