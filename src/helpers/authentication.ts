import { FastifyInstance } from 'fastify'

export function auth(app: FastifyInstance) {
  return { preHandler: [app.authenticate] }
}
