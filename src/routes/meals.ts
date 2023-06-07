import { FastifyInstance } from 'fastify'

import { randomUUID } from 'node:crypto'

import { knex } from '../database'
import { auth } from '../helpers/authentication'
import { z } from 'zod'

const routes = async (app: FastifyInstance) => {
  app.get('/:id', auth(app), async (request, reply) => {
    const getMealParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = getMealParamsSchema.parse(request.params)

    const meal = await knex('meals').where('id', id).first()

    if (!meal) {
      return reply.status(404).send('Meal not found')
    }

    return reply.status(200).send(meal)
  })

  app.post('/', auth(app), async (request, reply) => {
    const createMealBodySchema = z.object({
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
    } = createMealBodySchema.parse(request.body)

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
    const updateMealBodySchema = z.object({
      name: z.string().nonempty(),
      description: z.string().nonempty(),
      date: z.string().nonempty(),
      time: z.string().nonempty(),
      included_in_diet: z.boolean().default(false),
    })

    const updateMealParamsSchema = z.object({
      id: z.string(),
    })

    const {
      name,
      description,
      date,
      time,
      included_in_diet: includedInDiet,
    } = updateMealBodySchema.parse(request.body)

    const { id } = updateMealParamsSchema.parse(request.params)

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
