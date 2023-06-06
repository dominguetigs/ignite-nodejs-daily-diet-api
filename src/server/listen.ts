import { FastifyInstance } from 'fastify'

export function listen(app: FastifyInstance) {
  app
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
}
