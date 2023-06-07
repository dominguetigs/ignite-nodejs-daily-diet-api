import { z } from 'zod'

export const UserCreateRequestBodySchema = z
  .object({
    name: z.string().nonempty(),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirm'],
  })
