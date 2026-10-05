import type { FastifyInstance } from 'fastify'

import { verifyJwt } from '../../middlewares/verify-jwt'

import { create } from './create'
import { fetch } from './fetch'
import { details } from './details'

export async function petsRoutes(app: FastifyInstance) {
  app.get('/pets', fetch)
  app.get('/pets/:petId', details)

  app.post('/pets', { onRequest: [verifyJwt] }, create)
}
