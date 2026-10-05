import { beforeEach, describe, expect, it } from 'vitest'
import { GetPetDetailsUseCase } from '../get-pet-details'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

let orgsRepository: InMemoryOrgsRepository
let petsRepository: InMemoryPetsRepository
let sut: GetPetDetailsUseCase

describe('Get Pet Details Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new GetPetDetailsUseCase(petsRepository, orgsRepository)
  })

  it('should be able to get pet details with the org contact', async () => {
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

    const createdPet = await petsRepository.create({
      name: 'Alfredo',
      about: null,
      age: 'PUPPY',
      size: 'SMALL',
      energy_level: 'HIGH',
      independence_level: 'LOW',
      environment: 'MEDIUM',
      photos: [],
      requirements: [],
      org_id: org.id,
    })

    const { pet, org: petOrg } = await sut.execute({ petId: createdPet.id })

    expect(pet.name).toEqual('Alfredo')
    expect(petOrg.whatsapp).toEqual('62999999999')
  })

  it('should not be able to get a pet that does not exist', async () => {
    await expect(() => {
      return sut.execute({ petId: 'non-existent-pet' })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
