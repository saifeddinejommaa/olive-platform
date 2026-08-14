import { useState } from 'react'
import DataTable from '../../../../common/widgets/tables/OrdersTable'
import Button from '../../../../common/widgets/button/Button'
import TextInput from '../../../../common/widgets/textInput/TextInput'
import Select from '../../../../common/widgets/select/Select'

type Worker = {
  id: number
  code: string
  name: string
  phone: string | null
  workerType: string | null
  dailyRate: number | null
  isActive: boolean
  workSessionsCount: number
}

const mockWorkers: Worker[] = []

export default function WorkersPage() {
  const [pageNumber, setPageNumber] = useState(1)

  const columns = [
    {
      key: 'code' as keyof Worker,
      label: 'Code',
    },
    {
      key: 'name' as keyof Worker,
      label: 'Nom',
    },
    {
      key: 'phone' as keyof Worker,
      label: 'Téléphone',
    },
    {
      key: 'workerType' as keyof Worker,
      label: 'Type',
    },
    {
      key: 'dailyRate' as keyof Worker,
      label: 'Tarif journalier',
      render: (item: Worker) =>
        item.dailyRate !== null
          ? `${item.dailyRate.toLocaleString()} €`
          : '—',
    },
    {
      key: 'isActive' as keyof Worker,
      label: 'Statut',
      render: (item: Worker) => (
        <span className="status-badge">
          {item.isActive ? 'Actif' : 'Inactif'}
        </span>
      ),
    },
    {
      key: 'workSessionsCount' as keyof Worker,
      label: 'Sessions',
    },
  ]

  return (
    <div className="feature-page">

      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">
            Ouvriers
          </h1>

          <p className="page-description">
            Gestion des ouvriers et des sessions de travail.
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
          placeholder="Type..."
        />

        <Select
          defaultValue=""
          options={[
            {
              value: '',
              label: 'Tous',
            },
            {
              value: 'true',
              label: 'Actifs',
            },
            {
              value: 'false',
              label: 'Inactifs',
            },
          ]}
        />

        <Button variant="secondary">
          Rechercher
        </Button>

      </div>

      <DataTable
        data={mockWorkers}
        columns={columns}
        pageNumber={pageNumber}
        pageSize={10}
        totalCount={mockWorkers.length}
        onPageChange={setPageNumber}
      />

    </div>
  )
}