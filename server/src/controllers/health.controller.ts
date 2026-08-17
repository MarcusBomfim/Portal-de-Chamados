import type { NextFunction, Request, Response } from 'express'
import { database } from '../database/pool.js'

export function checkApiHealth(_request: Request, response: Response) {
  response.status(200).json({
    status: 'ok',
    service: 'portal-chamados-api',
    timestamp: new Date().toISOString(),
  })
}

export async function checkDatabaseHealth(
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    await database.query('SELECT 1')

    response.status(200).json({
      status: 'ok',
      database: 'postgresql',
    })
  } catch (error) {
    next(error)
  }
}
