import type { QueryResultRow } from 'pg'
import { database } from '../database/pool.js'

interface UnitRecord extends QueryResultRow {
  id: string
  name: string
  acronym: string
  type: 'HEALTH_UNIT' | 'SUPPORT_CENTER'
}

export async function listActiveUnits() {
  const result = await database.query<UnitRecord>(
    `SELECT id, name, acronym, type
     FROM units
     WHERE active = TRUE
     ORDER BY type DESC, name ASC`,
  )

  return result.rows
}
