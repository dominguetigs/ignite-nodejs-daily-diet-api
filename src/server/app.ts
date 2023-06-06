import fastify from 'fastify'
import { setupPlugins } from './plugin'

export const app = fastify()

setupPlugins(app)
