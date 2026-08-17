export const unitTypes = ['HEALTH_UNIT', 'SUPPORT_CENTER'] as const

export type UnitType = (typeof unitTypes)[number]

export interface Unit {
  id: string
  name: string
  acronym: string
  type: UnitType
  address: string
  active: boolean
}
