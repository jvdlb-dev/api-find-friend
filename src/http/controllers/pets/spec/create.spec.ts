import { expect, describe, it, afterAll, beforeAll } from 'vitest'
import { app } from '@/app'
import supertest from 'supertest'
import { createAndAuthenticateOrg } from '@/use-cases/utils/test/create-and-authenticate-org'

const request = supertest

describe('Create Pet Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  const petBody = {
    name: 'Alfredo',
    about: 'Um cachorro muito dócil',
    age: 'PUPPY',
    size: 'SMALL',
    energy_level: 'HIGH',
    independence_level: 'LOW',
    environment: 'MEDIUM',
    photos: ['https://example.com/alfredo.png'],
    requirements: ['Local grande para o animal correr'],
  }

  it('should be able to create a pet', async () => {
    const { token } = await createAndAuthenticateOrg(app)

    const response = await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send(petBody)

    expect(response.statusCode).toEqual(201)
    expect(response.body.pet).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        org_id: expect.any(String),
        name: 'Alfredo',
      }),
    )
  })

  it('should not be able to create a pet without being logged in', async () => {
    const response = await request(app.server).post('/pets').send(petBody)

    expect(response.statusCode).toEqual(401)
  })
})
