import type { QueryResultRow } from 'pg'
import { database } from '../database/pool.js'
import type { UserRole } from '../types/auth.js'
import type { AdminUnitRecord, AdminUserRecord } from '../types/admin.js'

interface AdminUserRow extends QueryResultRow, AdminUserRecord {}
interface AdminUnitRow extends QueryResultRow, AdminUnitRecord {}

const adminUserSelect = `
  SELECT
    users.id,
    users.full_name AS "fullName",
    users.email,
    users.role,
    users.unit_id AS "unitId",
    units.name AS "unitName",
    users.active,
    users.created_at AS "createdAt"
  FROM users
  LEFT JOIN units ON units.id = users.unit_id
`

export async function listAdminUsers() {
  const result = await database.query<AdminUserRow>(
    `${adminUserSelect}
     ORDER BY users.active DESC, users.full_name ASC`,
  )

  return result.rows
}

export async function updateAdminUser(
  userId: string,
  input: {
    role?: UserRole
    unitId?: string | null
    active?: boolean
  },
) {
  const hasUnitId = Object.hasOwn(input, 'unitId')
  const updateResult = await database.query(
    `UPDATE users
     SET
       role = COALESCE($2, role),
       unit_id = CASE WHEN $3::boolean THEN $4::uuid ELSE unit_id END,
       active = COALESCE($5, active)
     WHERE id = $1`,
    [
      userId,
      input.role ?? null,
      hasUnitId,
      input.unitId ?? null,
      input.active ?? null,
    ],
  )

  if (updateResult.rowCount === 0) {
    return null
  }

  const result = await database.query<AdminUserRow>(
    `${adminUserSelect} WHERE users.id = $1 LIMIT 1`,
    [userId],
  )

  return result.rows[0] ?? null
}

export async function listAdminUnits() {
  const result = await database.query<AdminUnitRow>(
    `SELECT
       id,
       name,
       acronym,
       type,
       address,
       active,
       created_at AS "createdAt"
     FROM units
     ORDER BY active DESC, name ASC`,
  )

  return result.rows
}

export async function createAdminUnit(input: {
  name: string
  acronym: string
  type: 'HEALTH_UNIT' | 'SUPPORT_CENTER'
  address: string
}) {
  const result = await database.query<AdminUnitRow>(
    `INSERT INTO units (name, acronym, type, address)
     VALUES ($1, $2, $3, $4)
     RETURNING
       id,
       name,
       acronym,
       type,
       address,
       active,
       created_at AS "createdAt"`,
    [input.name, input.acronym, input.type, input.address],
  )

  return result.rows[0]
}

export async function updateAdminUnit(
  unitId: string,
  input: {
    name?: string
    acronym?: string
    type?: 'HEALTH_UNIT' | 'SUPPORT_CENTER'
    address?: string
    active?: boolean
  },
) {
  const result = await database.query<AdminUnitRow>(
    `UPDATE units
     SET
       name = COALESCE($2, name),
       acronym = COALESCE($3, acronym),
       type = COALESCE($4, type),
       address = COALESCE($5, address),
       active = COALESCE($6, active)
     WHERE id = $1
     RETURNING
       id,
       name,
       acronym,
       type,
       address,
       active,
       created_at AS "createdAt"`,
    [
      unitId,
      input.name ?? null,
      input.acronym ?? null,
      input.type ?? null,
      input.address ?? null,
      input.active ?? null,
    ],
  )

  return result.rows[0] ?? null
}
