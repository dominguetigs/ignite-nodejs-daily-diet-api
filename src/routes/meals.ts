import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { randomUUID } from 'node:crypto'

import { auth } from '../helpers/authentication'
import { UserSchema } from '../schemas/user'
import { knex } from '../database'

const routes = async (app: FastifyInstance) => {
  app.post('/', auth(app), async (request, reply) => {
    const createMealRequestBodySchema = z.object({
      name: z.string().nonempty(),
      description: z.string().nonempty(),
      date: z.string().nonempty(),
      time: z.string().nonempty(),
      included_in_diet: z.boolean().default(false),
    })

    const {
      name,
      description,
      date,
      time,
      included_in_diet: includedInDiet,
    } = createMealRequestBodySchema.parse(request.body)

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
