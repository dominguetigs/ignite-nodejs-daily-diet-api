import fastify from 'fastify'
import { fastifyJwt } from '@fastify/jwt'

import { usersRoutes } from './routes'

const server = fastify()

server.register(fastifyJwt, { secret: '123456789876543210' })

server.register(usersRoutes, { prefix: 'users' })

server
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log(`HTTP Server Running!`)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
