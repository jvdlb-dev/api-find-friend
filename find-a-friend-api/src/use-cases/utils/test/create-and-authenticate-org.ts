import { randomUUID } from 'crypto'
import type { FastifyInstance } from 'fastify/types/instance'
import request from 'supertest'

interface CreateAndAuthenticateOrgParams {
  city?: string
}

export async function createAndAuthenticateOrg(
  app: FastifyInstance,
  { city = 'Goiânia' }: CreateAndAuthenticateOrgParams = {},
) {
  const email = `org-${randomUUID()}@example.com`

  await request(app.server).post('/orgs').send({
    name: 'Amigos dos Bichos',
    author_name: 'John Doe',
    email,
    password: 'password123',
    whatsapp: '62999999999',
    cep: '74000000',
    state: 'GO',
    city,
    neighborhood: 'Centro',
    street: 'Rua 1',
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email,
    password: 'password123',
  })

  const { token } = authResponse.body

  return {
    token,
    email,
    city,
  }
}
