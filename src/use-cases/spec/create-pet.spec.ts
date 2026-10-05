import { beforeEach, describe, expect, it } from 'vitest'
import { CreatePetUseCase } from '../create-pet'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

let orgsRepository: InMemoryOrgsRepository
let petsRepository: InMemoryPetsRepository
let sut: CreatePetUseCase

const petData = {
  name: 'Alfredo',
  about: 'Um cachorro muito dócil',
  age: 'PUPPY' as const,
  size: 'SMALL' as const,
  energy_level: 'HIGH' as const,
  independence_level: 'LOW' as const,
  environment: 'MEDIUM' as const,
  photos: ['https://example.com/alfredo.png'],
  requirements: ['Local grande para o animal correr'],
}

describe('Create Pet Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new CreatePetUseCase(petsRepository, orgsRepository)
  })

  it('should be able to create a pet linked to an org', async () => {
    const org = await orgsRepository.create({
      name: 'Amigos dos Bichos',
      author_name: 'John Doe',
      email: 'org@example.com',
      password_hash: '123456',
      whatsapp: '62999999999',
      cep: '74000000',
      state: 'GO',
      city: 'Goiânia',
      neighborhood: 'Centro',
      street: 'Rua 1',
    })

    const { pet } = await sut.execute({ ...petData, org_id: org.id })

    expect(pet.id).toEqual(expect.any(String))
    expect(pet.org_id).toEqual(org.id)
    expect(petsRepository.items).toHaveLength(1)
  })

  it('should not be able to create a pet without an existing org', async () => {
    await expect(() => {
      return sut.execute({ ...petData, org_id: 'non-existent-org' })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
