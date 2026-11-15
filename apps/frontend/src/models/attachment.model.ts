export interface Attachment {
  id: string
  taskId: string
  name: string
  /** Tipo MIME del archivo. */
  type: string
  /** Tamaño en bytes. */
  size: number
  data: Blob
  createdAt: string
}

/** Tamaño máximo por archivo (10 MB). */
export const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024
