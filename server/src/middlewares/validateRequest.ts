import type { NextFunction, Request, Response } from 'express'
import type { ZodType } from 'zod'

export function validateBody(schema: ZodType) {
  return (request: Request, response: Response, next: NextFunction) => {
    const result = schema.safeParse(request.body)

    if (!result.success) {
      response.status(422).json({
        message: 'Verifique os dados informados.',
        errors: result.error.flatten().fieldErrors,
      })
      return
    }

    request.body = result.data
    next()
  }
}

export function validateParams(schema: ZodType) {
  return (request: Request, response: Response, next: NextFunction) => {
    const result = schema.safeParse(request.params)

    if (!result.success) {
      response.status(400).json({ message: 'Identificador inválido.' })
      return
    }

    next()
  }
}
