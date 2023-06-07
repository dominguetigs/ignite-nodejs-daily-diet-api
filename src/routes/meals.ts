import { FastifyInstance } from 'fastify'

import { randomUUID } from 'node:crypto'

import { knex } from '../database'
import { auth } from '../helpers/authentication'
import { z } from 'zod'

const routes = async (app: FastifyInstance) => {
  app.get('/', auth(app), async (request, reply) => {
    const meals = await knex('meals')
      .where('user_id', request.user_data?.id)
      .select()

    const response = {
      items: meals,
    }

    return reply.status(200).send(response)
  })

  app.get('/:id', auth(app), async (request, reply) => {
    const getMealParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = getMealParamsSchema.parse(request.params)

    const meal = await knex('meals')
      .where({ id, user_id: request.user_data?.id })
      .first()

    if (!meal) {
      return reply.status(404).send('Meal not found')
    }

    return reply.status(200).send(meal)
  })

  app.get('/summary', auth(app), async (request, reply) => {
    const subquery = knex('meals')
      .where('user_id', request.user_data?.id)
      .select('date')
      .where('included_in_diet', 1)
      .sum('included_in_diet AS total')
      .groupBy('date')

    const includedIdDietQuery =
      'COALESCE(SUM(CASE WHEN included_in_diet = 1 THEN 1 ELSE 0 END), 0) AS included_in_diet'

    const notIncludedInDietQuery =
      'COALESCE(SUM(CASE WHEN included_in_diet = 0 THEN 1 ELSE 0 END), 0) AS not_included_in_diet'

    const maxTotalQuery = `(
      SELECT COALESCE(MAX(sub.total), 0)
      FROM (${subquery.toQuery()}) AS sub
    ) AS max_total`

    const summary = await knex('meals')
      .where('user_id', request.user_data?.id)
      .select(
        knex.raw('COUNT(*) AS total'),
        knex.raw(includedIdDietQuery),
        knex.raw(notIncludedInDietQuery),
        knex.raw(maxTotalQuery),
      )
      .first()

    return reply.status(200).send(summary)
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

    await knex('meals').where({ id, user_id: request.user_data?.id }).update({
      id,
      name,
      description,
      date,
      time,
      included_in_diet: includedInDiet,
    })

    return reply.status(200).send()
  })

  app.delete('/:id', auth(app), async (request, reply) => {
    const deleteMealParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = deleteMealParamsSchema.parse(request.params)

    await knex('meals').where({ id, user_id: request.user_data?.id }).delete()

    return reply.status(200).send('Meal successfully deleted')
  })
}

export default routes
export const autoPrefix = '/meals'
