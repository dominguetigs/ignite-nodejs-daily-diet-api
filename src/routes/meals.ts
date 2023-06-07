import { FastifyInstance } from 'fastify'

import { randomUUID } from 'node:crypto'

import { auth } from '../helpers/authentication'
import { UserSchema } from '../schemas/user'
import { knex } from '../database'
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
      user_id: UserSchema.parse(request.user).id,
    }

    return await knex('meals').insert(meal).returning('*')
  })
}

export default routes
export const autoPrefix = '/meals'
