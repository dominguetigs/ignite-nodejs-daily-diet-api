import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import { z } from 'zod'

import { knex } from '../database'

const authenticate = async (
  app: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply,
  authorization: string,
) => {
  const token = authorization?.replace(/^Bearer\s/, '')
  const decodedUser = app.jwt.decode(token)

  const userSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  })

  const decoded = userSchema.parse(decodedUser)

  if (!decoded || !decoded?.id) {
    return reply.status(400).send('Malformed token')
  }

  const user = await knex('users').where('id', decoded.id).first()

  if (!user) {
    return reply.status(401).send('User not found')
  }

  if (token !== user.token) {
    return reply.status(401).send('Token expired')
  }

  request.user_data = user
  return user
}

export default fp(async (app: FastifyInstance) => {
  app.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        const { authorization } = request.headers

        console.log(authorization)

        if (!authorization) {
          return reply.status(401).send()
        }

        await authenticate(app, request, reply, authorization)
      } catch (err) {
        reply.send(err)
      }
    },
  )
})
