import type { ErrorRequestHandler } from 'express'
import { AppError } from '../errors/AppError.js'

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({ message: error.message })
    return
  }

  console.error(error)

  response.status(500).json({
    message: 'Ocorreu um erro interno no servidor.',
  })
}
