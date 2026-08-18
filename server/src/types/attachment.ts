export interface AttachmentRecord {
  id: string
  ticketId: string
  messageId: string | null
  fileName: string
  storageKey: string
  contentType: string
  sizeInBytes: number
  uploadedById: string
  uploadedByName: string
  createdAt: Date
}
