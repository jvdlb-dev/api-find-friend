import { beforeEach, describe, expect, it } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { AuthenticateUseCase } from '../authenticate'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

let orgsRepository: InMemoryOrgsRepository
let sut: AuthenticateUseCase

async function createOrg() {
  return orgsRepository.create({
    name: 'Amigos dos Bichos',
    author_name: 'John Doe',
    email: 'org@example.com',
    password_hash: await hash('123456', 6),
    whatsapp: '62999999999',
    cep: '74000000',
    state: 'GO',
    city: 'Goiânia',
    neighborhood: 'Centro',
    street: 'Rua 1',
  })
}

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new AuthenticateUseCase(orgsRepository)
  })

  it('should be able to authenticate', async () => {
    await createOrg()

    const { org } = await sut.execute({
      email: 'org@example.com',
      password: '123456',
    })

    expect(org.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() => {
      return sut.execute({
        email: 'wrong@example.com',
        password: '123456',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await createOrg()

    await expect(() => {
      return sut.execute({
        email: 'org@example.com',
        password: '123123',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
