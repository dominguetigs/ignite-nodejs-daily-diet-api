import { z } from 'zod'

export const CreateMealRequestBodySchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  date: z.string().nonempty(),
  time: z.string().nonempty(),
  included_in_diet: z.boolean().default(false),
})
