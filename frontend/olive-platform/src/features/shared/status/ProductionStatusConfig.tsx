import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'


import type { StatusConfig } from '../utils/StatusUtils'
import { ProductionStatus,
  type ProductionStatus as ProductionStatusType, } from '../../production/domain/entities/ProductionStatus'

export const productionStatusConfig: StatusConfig<ProductionStatusType> = {
  [ProductionStatus.Planned]: {
    label: 'Planifiée',
    icon: EventAvailableIcon,
    color: 'info',
  },

  [ProductionStatus.InProgress]: {
    label: 'En cours',
    icon: AutorenewIcon,
    color: 'warning',
  },

  [ProductionStatus.Completed]: {
    label: 'Terminée',
    icon: CheckCircleIcon,
    color: 'success',
  },

  [ProductionStatus.Cancelled]: {
    label: 'Annulée',
    icon: CancelIcon,
    color: 'error',
  },
}