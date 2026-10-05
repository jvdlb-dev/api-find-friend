import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterOrgUseCase } from '../register-org'
import { compare } from 'bcryptjs'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { OrgAlreadyExistsError } from '../errors/org-already-exists-error'

let orgsRepository: InMemoryOrgsRepository
let sut: RegisterOrgUseCase

const orgData = {
  name: 'Amigos dos Bichos',
  author_name: 'John Doe',
  email: 'org@example.com',
  password: 'password123',
  whatsapp: '62999999999',
  cep: '74000000',
  state: 'GO',
  city: 'Goiânia',
  neighborhood: 'Centro',
  street: 'Rua 1',
}

describe('Register Org Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new RegisterOrgUseCase(orgsRepository)
  })

  it('should be able to register a new org', async () => {
    const { org } = await sut.execute(orgData)

    expect(org.id).toEqual(expect.any(String))
    expect(org).toEqual(
      expect.objectContaining({
        name: 'Amigos dos Bichos',
        whatsapp: '62999999999',
        city: 'Goiânia',
        street: 'Rua 1',
      }),
    )
  })

  it('should hash org password upon registration', async () => {
    const { org } = await sut.execute(orgData)

    const isPasswordCorrectlyHashed = await compare(
      'password123',
      org.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with an existing email', async () => {
    await sut.execute(orgData)

    await expect(() => {
      return sut.execute(orgData)
    }).rejects.toBeInstanceOf(OrgAlreadyExistsError)
  })
})
