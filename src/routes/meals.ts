import { FastifyInstance } from 'fastify'

import { randomUUID } from 'node:crypto'

import { knex } from '../database'
import { auth } from '../helpers/authentication'
import { CreateMealRequestBodySchema } from '../schemas/createMealRequestBody'

const routes = async (app: FastifyInstance) => {
  app.post('/', auth(app), async (request, reply) => {
    const {
      name,
      description,
      date,
      time,
      included_in_diet: includedInDiet,
    } = CreateMealRequestBodySchema.parse(request.body)

    const meal = {
      id: randomUUID(),
      name,
      description,
      date,
      time,
      included_in_diet: includedInDiet,
      user_id: request.user_data?.id,
    }

    return await knex('meals').insert(meal).returning('*')
  })
}

export default routes
export const autoPrefix = '/meals'
