// eslint-disable-next-line no-unused-vars
import { FastifyInstance } from 'fastify'
import {
  FastifyReplyType,
  FastifyRequestType,
} from 'fastify/types/type-provider'

declare module 'fastify' {
  // eslint-disable-next-line no-unused-vars
  interface FastifyInstance {
    authenticate(
      request: FastifyRequestType,
      reply: FastifyReplyType,
    ): Promise<void>
  }
}
