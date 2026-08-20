import type { ElementType } from 'react'
import type { SvgIconProps } from '@mui/material/SvgIcon'

export type StatusConfig<T extends string | number> = Record<
  T,
  {
    label: string
    icon: ElementType<SvgIconProps>
    color?: SvgIconProps['color']
  }
>

export function renderStatus<T extends string | number>(
  status: T,
  config: StatusConfig<T>
) {
  const statusConfig = config[status]

  if (!statusConfig) {
    return status
  }

  const Icon = statusConfig.icon

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <Icon fontSize="small" color={statusConfig.color} />
      <span>{statusConfig.label}</span>
    </div>
  )
}