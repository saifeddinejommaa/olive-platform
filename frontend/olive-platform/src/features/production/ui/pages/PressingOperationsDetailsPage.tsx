import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Button from '../../../../common/widgets/button/Button'
import { formatDateTime } from '../../../shared/utils/DatesUtils'
import { productionStatusConfig } from '../../../shared/status/ProductionStatusConfig'
import { renderStatus } from '../../../shared/utils/StatusUtils'

type PressingOperationInputDetails = {
  id: number
  sourceType: 'harvest' | 'purchase'
  reference: string
  quantityKg: number
  harvestId: number | null
  purchaseItemId: number | null
}

type PressingOperationDetails = {
  id: number
  operationNumber: string
  pressingDate: string
  status: number
  oliveQuantityKg: number
  oilQuantityLiters: number | null
  startTime: string | null
  endTime: string | null
  notes: string | null
  inputs: PressingOperationInputDetails[]
}

export default function PressingOperationDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [operation, setOperation] = useState<PressingOperationDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadOperation = async () => {
      if (!id) {
        setError('Identifiant de l’opération invalide.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // TODO: remplacer par ton use case / hook
        // const data = await GetPressingOperationById(Number(id))
        // setOperation(data)

      } catch {
        setError('Impossible de récupérer les détails de l’opération.')
      } finally {
        setLoading(false)
      }
    }

    loadOperation()
  }, [id])

  const handleBack = () => {
    navigate('/production')
  }

  const handleEdit = () => {
    if (!operation) return
    navigate(`/production/pressing-operations/${operation.id}/edit`)
  }

  if (loading) {
    return (
      <div className="feature-page">
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">Opération de pression</h1>
            <p className="page-description">Chargement des détails...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !operation) {
    return (
      <div className="feature-page">
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">Opération de pression</h1>
            <p className="page-description">{error ?? 'Opération introuvable.'}</p>
          </div>
        </div>

        <div className="filters-footer">
          <Button variant="secondary" onClick={handleBack}>
            <ArrowBackIcon fontSize="small" />
            Retour
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="feature-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">
            Opération {operation.operationNumber}
          </h1>

          <p className="page-description">
            Détails de l'opération de pression.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="secondary" onClick={handleBack}>
            <ArrowBackIcon fontSize="small" />
            Retour
          </Button>

          <Button variant="primary" onClick={handleEdit}>
            <EditIcon fontSize="small" />
            Modifier
          </Button>
        </div>
      </div>

      <div className="filters">
        <div className="filters-header">
          <div>
            <h3>Informations générales</h3>
            <span>Informations relatives à l'opération de pression</span>
          </div>
        </div>

        <div className="filters-content">
          <div className="filter-item">
            <label>N° Pression</label>
            <div>{operation.operationNumber}</div>
          </div>

          <div className="filter-item">
            <label>Date de pression</label>
            <div>{operation.startTime? formatDateTime(new Date(operation.startTime!)):"-"}</div>
          </div>

          <div className="filter-item">
            <label>Quantité d'olives</label>
            <div>
              {operation.oliveQuantityKg.toLocaleString()} kg
            </div>
          </div>

          <div className="filter-item">
            <label>Huile produite</label>
            <div>
              {operation.oilQuantityLiters !== null
                ? `${operation.oilQuantityLiters.toLocaleString()} L`
                : '—'}
            </div>
          </div>

          <div className="filter-item">
            <label>Début</label>
            <div>
              {operation.startTime
                ? formatDateTime(new Date(operation.startTime))
                : '—'}
            </div>
          </div>

          <div className="filter-item">
            <label>Fin</label>
            <div>
              {operation.endTime
                ? formatDateTime(new Date(operation.endTime))
                : '—'}
            </div>
          </div>

          <div
            className="filter-item"
            style={{ gridColumn: '1 / -1' }}
          >
            <label>Notes</label>
            <div>
              {operation.notes || '—'}
            </div>
          </div>
        </div>
      </div>

      <div className="filters">
        <div className="filters-header">
          <div>
            <h3>Olives utilisées</h3>
            <span>
              Sources d'olives utilisées pour cette opération de pression
            </span>
          </div>
        </div>

        <div className="filters-content">
          {operation.inputs.length === 0 ? (
            <div>Aucune source d'olives.</div>
          ) : (
            <div style={{ gridColumn: '1 / -1' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '10px' }}>
                      Type
                    </th>
                    <th style={{ textAlign: 'left', padding: '10px' }}>
                      Référence
                    </th>
                    <th style={{ textAlign: 'right', padding: '10px' }}>
                      Quantité
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {operation.inputs.map(input => (
                    <tr key={input.id}>
                      <td style={{ padding: '10px' }}>
                        {input.sourceType === 'harvest'
                          ? 'Récolte'
                          : 'Achat'}
                      </td>

                      <td style={{ padding: '10px' }}>
                        {input.reference}
                      </td>

                      <td
                        style={{
                          padding: '10px',
                          textAlign: 'right',
                        }}
                      >
                        {input.quantityKg.toLocaleString()} kg
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}