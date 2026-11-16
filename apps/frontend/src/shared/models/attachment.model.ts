export interface Attachment {
  id: string
  taskId: string
  name: string
  type: string
  size: number
  data: Blob
  createdAt: string
}

export const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024
