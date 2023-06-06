import { FastifyInstance } from 'fastify'
import { auth } from '../helpers/authentication'

const routes = async (app: FastifyInstance) => {
  app.get('/', auth(app), async (request, reply) => {
    return 1
  })
}

export default routes
export const autoPrefix = '/meals'
