import { FastifyInstance } from 'fastify'
import bcrypt from 'bcrypt'
import { randomUUID } from 'node:crypto'

import { knex } from '../database'
import { z } from 'zod'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const users = await knex('users').select(
      'id',
      'name',
      'email',
      'created_at',
    )
    return users
  })

  app.post('/', async (request, reply) => {
    const userCreateRequestBodySchema = z
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

    const { email, name, password } = userCreateRequestBodySchema.parse(
      request.body,
    )

    const userExists = await knex('users').where('email', email).first()

    if (userExists) {
      return reply.status(409).send()
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const userData = {
      id: randomUUID(),
      name,
      email,
    }

    const token = app.jwt.sign(userData)

    Object.assign(userData, { password: hashedPassword })

    await knex('users').insert({ ...userData, token })

    return reply.status(201).send({ token })
  })

  app.post('/login', async (request, reply) => {
    const signInUserRequestBodySchema = z.object({
      email: z.string().email().nonempty(),
      password: z.string(),
    })

    const { email, password } = signInUserRequestBodySchema.parse(request.body)

    const user = await knex('users').where('email', email).first()

    if (!user) {
      return reply.status(401).send('Invalid credentials')
    }

    const passwordMatched = await bcrypt.compare(password, user.password)

    if (!passwordMatched) {
      return reply.status(401).send('Invalid credentials')
    }

    const token = app.jwt.sign({
      id: user.id,
      name: user.name,
      email,
    })

    const updatedUser = await knex('users')
      .update({
        token,
      })
      .returning(['id', 'name', 'email', 'created_at', 'token'])

    return updatedUser
  })
}
