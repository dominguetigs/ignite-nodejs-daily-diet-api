import { FastifyInstance } from 'fastify'

import { randomUUID } from 'node:crypto'

import { knex } from '../database'
import { auth } from '../helpers/authentication'
import { CreateMealRequestBodySchema } from '../schemas/createMealRequestBody'
import { UpdateMealBodySchema } from '../schemas/updateMealBody'
import { UpdateMealParamsSchema } from '../schemas/updateMealParams'

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

    await knex('meals').insert(meal).returning('*')

    return reply.status(201).send()
  })

  app.put('/:id', auth(app), async (request, reply) => {
    const {
      name,
      description,
      date,
      time,
      included_in_diet: includedInDiet,
    } = UpdateMealBodySchema.parse(request.body)

    const { id } = UpdateMealParamsSchema.parse(request.params)

    await knex('meals').where('id', id).update({
      id,
      name,
      description,
      date,
      time,
      included_in_diet: includedInDiet,
    })

    return reply.status(201).send()
  })
}

export default routes
export const autoPrefix = '/meals'
