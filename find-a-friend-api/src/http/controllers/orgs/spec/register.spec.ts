import { expect, describe, it, afterAll, beforeAll } from 'vitest'
import { app } from '@/app'
import supertest from 'supertest'
import { randomUUID } from 'node:crypto'

const request = supertest

describe('Register Org Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  const validBody = () => ({
    name: 'Amigos dos Bichos',
    author_name: 'John Doe',
    email: `org-${randomUUID()}@example.com`,
    password: 'password123',
    whatsapp: '62999999999',
    cep: '74000000',
    state: 'GO',
    city: 'Goiânia',
    neighborhood: 'Centro',
    street: 'Rua 1',
  })

  it('should be able to register an org', async () => {
    const response = await request(app.server).post('/orgs').send(validBody())

    expect(response.statusCode).toEqual(201)
  })

  it('should not be able to register an org without whatsapp', async () => {
    const { whatsapp, ...body } = validBody()

    const response = await request(app.server).post('/orgs').send(body)

    expect(whatsapp).toBeDefined()
    expect(response.statusCode).toEqual(400)
  })

  it('should not be able to register an org without address', async () => {
    const { street, ...body } = validBody()

    const response = await request(app.server).post('/orgs').send(body)

    expect(street).toBeDefined()
    expect(response.statusCode).toEqual(400)
  })

  it('should not be able to register an org with an existing email', async () => {
    const body = validBody()

    await request(app.server).post('/orgs').send(body)
    const response = await request(app.server).post('/orgs').send(body)

    expect(response.statusCode).toEqual(409)
  })
})
