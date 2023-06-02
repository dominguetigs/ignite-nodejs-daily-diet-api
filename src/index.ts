import fastify from 'fastify'

const server = fastify()

server.get('/ping', async () => {
  return 'pong\n'
})

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
