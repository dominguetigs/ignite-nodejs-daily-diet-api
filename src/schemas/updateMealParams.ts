import { z } from 'zod'

export const UpdateMealParamsSchema = z.object({
  id: z.string(),
})
