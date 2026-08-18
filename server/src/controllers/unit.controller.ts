import type { Request, Response } from 'express'
import { listActiveUnits } from '../repositories/unit.repository.js'

export async function listUnits(_request: Request, response: Response) {
  const units = await listActiveUnits()
  response.status(200).json({ units })
}
