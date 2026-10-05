import { randomUUID } from 'node:crypto'
import { expect, describe, it, afterAll, beforeAll } from 'vitest'
import { app } from '@/app'
import supertest from 'supertest'
import { createAndAuthenticateOrg } from '@/use-cases/utils/test/create-and-authenticate-org'

const request = supertest

describe('Fetch Pets Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  function petBody(overrides: Record<string, unknown> = {}) {
    return {
      name: 'Alfredo',
      about: null,
      age: 'PUPPY',
      size: 'SMALL',
      energy_level: 'HIGH',
      independence_level: 'LOW',
      environment: 'MEDIUM',
      photos: [],
      requirements: [],
      ...overrides,
    }
  }

  it('should be able to list pets by city', async () => {
    const city = `Cidade ${randomUUID()}`
    const otherCity = `Cidade ${randomUUID()}`

    const { token } = await createAndAuthenticateOrg(app, { city })
    const { token: otherToken } = await createAndAuthenticateOrg(app, {
      city: otherCity,
    })

    await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send(petBody({ name: 'Pet da cidade' }))

    await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${otherToken}`)
      .send(petBody({ name: 'Pet de outra cidade' }))

    const response = await request(app.server).get('/pets').query({ city })

    expect(response.statusCode).toEqual(200)
    expect(response.body.pets).toHaveLength(1)
    expect(response.body.pets).toEqual([
      expect.objectContaining({ name: 'Pet da cidade' }),
    ])
  })

  it('should be able to filter pets by characteristics', async () => {
    const city = `Cidade ${randomUUID()}`
    const { token } = await createAndAuthenticateOrg(app, { city })

    await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send(petBody({ name: 'Filhote', age: 'PUPPY', size: 'SMALL' }))

    await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send(petBody({ name: 'Adulto Grande', age: 'ADULT', size: 'LARGE' }))

    const response = await request(app.server)
      .get('/pets')
      .query({ city, age: 'ADULT', size: 'LARGE' })

    expect(response.statusCode).toEqual(200)
    expect(response.body.pets).toEqual([
      expect.objectContaining({ name: 'Adulto Grande' }),
    ])
  })

  it('should not be able to list pets without a city', async () => {
    const response = await request(app.server).get('/pets')

    expect(response.statusCode).toEqual(400)
  })
})
