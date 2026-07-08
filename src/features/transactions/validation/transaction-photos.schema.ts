import { z } from 'zod'

const filesSchema = z.array(z.instanceof(File)).max(20, 'You can upload up to 20 photos')

export const transactionPhotosSchema = z.object({
  files: filesSchema.optional(),
})
