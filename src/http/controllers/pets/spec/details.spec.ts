import { randomUUID } from 'node:crypto'
import { expect, describe, it, afterAll, beforeAll } from 'vitest'
import { app } from '@/app'
import supertest from 'supertest'
import { createAndAuthenticateOrg } from '@/use-cases/utils/test/create-and-authenticate-org'

const request = supertest

describe('Pet Details Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get pet details with the org whatsapp', async () => {
    const city = `Cidade ${randomUUID()}`
    const { token } = await createAndAuthenticateOrg(app, { city })

    const createResponse = await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Alfredo',
        about: 'Um cachorro muito dócil',
        age: 'PUPPY',
        size: 'SMALL',
        energy_level: 'HIGH',
        independence_level: 'LOW',
        environment: 'MEDIUM',
        photos: [],
        requirements: [],
      })

    const response = await request(app.server).get(
      `/pets/${createResponse.body.pet.id}`,
    )

    expect(response.statusCode).toEqual(200)
    expect(response.body.pet).toEqual(
      expect.objectContaining({ name: 'Alfredo' }),
    )
    expect(response.body.org).toEqual(
      expect.objectContaining({ whatsapp: '62999999999' }),
    )
    expect(response.body.org.password_hash).toBeUndefined()
  })

  it('should return 404 for a pet that does not exist', async () => {
    const response = await request(app.server).get(`/pets/${randomUUID()}`)

    expect(response.statusCode).toEqual(404)
  })
})
