import { expect, describe, it, afterAll, beforeAll } from 'vitest'
import { app } from '@/app'
import supertest from 'supertest'
import { randomUUID } from 'node:crypto'

const request = supertest

describe('Authenticate Org Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    const email = `org-${randomUUID()}@example.com`

    await request(app.server).post('/orgs').send({
      name: 'Amigos dos Bichos',
      author_name: 'John Doe',
      email,
      password: 'password123',
      whatsapp: '62999999999',
      cep: '74000000',
      state: 'GO',
      city: 'Goiânia',
      neighborhood: 'Centro',
      street: 'Rua 1',
    })

    const response = await request(app.server).post('/sessions').send({
      email,
      password: 'password123',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      }),
    )
  })

  it('should not be able to authenticate with wrong credentials', async () => {
    const response = await request(app.server).post('/sessions').send({
      email: 'wrong@example.com',
      password: 'password123',
    })

    expect(response.statusCode).toEqual(400)
  })
})
