import { mkdirSync } from 'node:fs'
import { extname, resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import multer from 'multer'
import { AppError } from '../errors/AppError.js'

export const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024
export const uploadDirectory = resolve(process.cwd(), 'storage', 'uploads')

const allowedMimeTypes = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'text/plain',
])

mkdirSync(uploadDirectory, { recursive: true })

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (_request, file, callback) => {
    const extension = extname(file.originalname).toLowerCase().slice(0, 10)
    callback(null, `${randomUUID()}${extension}`)
  },
})

export const uploadAttachment = multer({
  storage,
  limits: {
    fileSize: MAX_ATTACHMENT_SIZE,
    files: 1,
    fields: 1,
    parts: 2,
  },
  fileFilter: (_request, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(
        new AppError(
          'Formato não permitido. Envie PDF, JPG, PNG ou arquivo de texto.',
          422,
        ),
      )
      return
    }

    callback(null, true)
  },
})
