import fastifyJwt from '@fastify/jwt'
import { FastifyInstance } from 'fastify'

import autoLoad from '@fastify/autoload'

import path from 'path'

export function setupPlugins(app: FastifyInstance) {
  app.register(fastifyJwt, { secret: '123456789876543210' })

  app.register(autoLoad, {
    dir: path.join(__dirname, '../plugins'),
    options: Object.assign({}),
  })

  app.register(autoLoad, {
    dir: path.join(__dirname, '../routes'),
    options: { prefix: 'api/v1' },
  })
}
