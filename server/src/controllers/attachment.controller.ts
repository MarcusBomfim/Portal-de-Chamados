import { open, unlink } from 'node:fs/promises'
import { basename, isAbsolute, relative, resolve } from 'node:path'
import type { NextFunction, Request, Response } from 'express'
import { uploadDirectory } from '../config/upload.js'
import { AppError } from '../errors/AppError.js'
import {
  createAttachment,
  findAttachment,
} from '../repositories/attachment.repository.js'
import type { AuthenticatedUser } from '../types/auth.js'
import type { TicketRecord } from '../types/ticket.js'

export async function storeAttachment(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const file = request.file

  try {
    if (!file) {
      throw new AppError('Selecione um arquivo para enviar.', 422)
    }

    if (!(await hasValidFileSignature(file.path, file.mimetype))) {
      throw new AppError('O conteúdo do arquivo não corresponde ao formato informado.', 422)
    }

    const ticketId = request.params.ticketId as string
    const user = response.locals.user as AuthenticatedUser
    const ticket = response.locals.ticket as TicketRecord

    if (ticket.status === 'CLOSED' || ticket.status === 'CANCELED') {
      throw new AppError('Não é possível anexar arquivos a um chamado encerrado.', 422)
    }

    const originalName = sanitizeOriginalName(file.originalname)
    const attachment = await createAttachment({
      ticketId,
      fileName: originalName,
      storageKey: file.filename,
      contentType: file.mimetype,
      sizeInBytes: file.size,
      uploadedById: user.id,
    })

    response.status(201).json({ attachment })
  } catch (error) {
    if (file?.path) {
      await unlink(file.path).catch(() => undefined)
    }

    next(error)
  }
}

export async function downloadAttachment(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const ticketId = request.params.ticketId as string
    const attachmentId = request.params.attachmentId as string
    const attachment = await findAttachment(ticketId, attachmentId)

    if (!attachment) {
      throw new AppError('Anexo não encontrado.', 404)
    }

    const filePath = resolve(uploadDirectory, attachment.storageKey)
    const relativePath = relative(uploadDirectory, filePath)

    if (relativePath.startsWith('..') || isAbsolute(relativePath)) {
      throw new AppError('Caminho do anexo inválido.', 500)
    }

    response.download(filePath, attachment.fileName, (error) => {
      if (error && !response.headersSent) {
        next(error)
      }
    })
  } catch (error) {
    next(error)
  }
}

function sanitizeOriginalName(fileName: string) {
  return Array.from(basename(fileName))
    .filter((character) => {
      const characterCode = character.charCodeAt(0)
      return characterCode >= 32 && characterCode !== 127
    })
    .join('')
    .slice(0, 255)
}

async function hasValidFileSignature(filePath: string, contentType: string) {
  const fileHandle = await open(filePath, 'r')

  try {
    const buffer = Buffer.alloc(512)
    const { bytesRead } = await fileHandle.read(buffer, 0, buffer.length, 0)
    const content = buffer.subarray(0, bytesRead)

    if (contentType === 'application/pdf') {
      return content.subarray(0, 5).toString('ascii') === '%PDF-'
    }

    if (contentType === 'image/png') {
      return content.subarray(0, 8).equals(
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      )
    }

    if (contentType === 'image/jpeg') {
      return content[0] === 0xff && content[1] === 0xd8 && content[2] === 0xff
    }

    if (contentType === 'text/plain') {
      return !content.includes(0)
    }

    return false
  } finally {
    await fileHandle.close()
  }
}
