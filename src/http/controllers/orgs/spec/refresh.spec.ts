import { expect, describe, it, afterAll, beforeAll } from 'vitest'
import { app } from '@/app'
import supertest from 'supertest'
import { randomUUID } from 'node:crypto'

const request = supertest

describe('Refresh Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to refresh the token', async () => {
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

    const authResponse = await request(app.server).post('/sessions').send({
      email,
      password: 'password123',
    })

    const cookies = authResponse.get('Set-Cookie')

    if (!cookies) {
      throw new Error('Missing Set-Cookie header')
    }

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      }),
    )
    expect(response.get('Set-Cookie')).toEqual(
      expect.arrayContaining([expect.stringContaining('refreshToken=')]),
    )
  })
})
