import type { ErrorRequestHandler } from 'express'
import multer from 'multer'
import { AppError } from '../errors/AppError.js'

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  if (error instanceof multer.MulterError) {
    const message =
      error.code === 'LIMIT_FILE_SIZE'
        ? 'O arquivo deve ter no máximo 5 MB.'
        : 'Não foi possível processar o arquivo enviado.'

    response.status(422).json({ message })
    return
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({ message: error.message })
    return
  }

  console.error(error)

  response.status(500).json({
    message: 'Ocorreu um erro interno no servidor.',
  })
}
