import { z } from 'zod'

export const SignInUserRequestBodySchema = z.object({
  email: z.string().email().nonempty(),
  password: z.string(),
})
