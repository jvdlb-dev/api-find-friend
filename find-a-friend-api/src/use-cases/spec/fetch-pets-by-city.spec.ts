import { beforeEach, describe, expect, it } from 'vitest'
import { FetchPetsByCityUseCase } from '../fetch-pets-by-city'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { CityIsRequiredError } from '../errors/city-is-required-error'

let orgsRepository: InMemoryOrgsRepository
let petsRepository: InMemoryPetsRepository
let sut: FetchPetsByCityUseCase

async function createOrg(city: string, email = `${city}@example.com`) {
  return orgsRepository.create({
    name: `Org ${city}`,
    author_name: 'John Doe',
    email,
    password_hash: '123456',
    whatsapp: '62999999999',
    cep: '74000000',
    state: 'GO',
    city,
    neighborhood: 'Centro',
    street: 'Rua 1',
  })
}

function makePet(
  org_id: string,
  overrides: Partial<Parameters<InMemoryPetsRepository['create']>[0]> = {},
) {
  return petsRepository.create({
    name: 'Alfredo',
    about: null,
    age: 'PUPPY',
    size: 'SMALL',
    energy_level: 'HIGH',
    independence_level: 'LOW',
    environment: 'MEDIUM',
    photos: [],
    requirements: [],
    org_id,
    ...overrides,
  })
}

describe('Fetch Pets By City Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new FetchPetsByCityUseCase(petsRepository)
  })

  it('should not be able to fetch pets without a city', async () => {
    await expect(() => {
      return sut.execute({ city: '', page: 1 })
    }).rejects.toBeInstanceOf(CityIsRequiredError)
  })

  it('should be able to fetch pets only from the given city', async () => {
    const orgGoiania = await createOrg('Goiânia')
    const orgRecife = await createOrg('Recife')

    await makePet(orgGoiania.id, { name: 'Pet Goiânia' })
    await makePet(orgRecife.id, { name: 'Pet Recife' })

    const { pets } = await sut.execute({ city: 'Goiânia', page: 1 })

    expect(pets).toHaveLength(1)
    expect(pets).toEqual([expect.objectContaining({ name: 'Pet Goiânia' })])
  })

  it('should be able to fetch pets from orgs in the same city', async () => {
    const orgA = await createOrg('Goiânia', 'a@example.com')
    const orgB = await createOrg('Goiânia', 'b@example.com')

    await makePet(orgA.id)
    await makePet(orgB.id)

    const { pets } = await sut.execute({ city: 'Goiânia', page: 1 })

    expect(pets).toHaveLength(2)
  })

  it('should be able to filter pets by characteristics', async () => {
    const org = await createOrg('Goiânia')

    await makePet(org.id, {
      name: 'Filhote Pequeno',
      age: 'PUPPY',
      size: 'SMALL',
    })
    await makePet(org.id, {
      name: 'Adulto Grande',
      age: 'ADULT',
      size: 'LARGE',
    })
    await makePet(org.id, {
      name: 'Adulto Pequeno',
      age: 'ADULT',
      size: 'SMALL',
    })

    const { pets } = await sut.execute({
      city: 'Goiânia',
      page: 1,
      filters: { age: 'ADULT', size: 'SMALL' },
    })

    expect(pets).toHaveLength(1)
    expect(pets).toEqual([expect.objectContaining({ name: 'Adulto Pequeno' })])
  })

  it('should be able to filter by energy level, independence level and environment', async () => {
    const org = await createOrg('Goiânia')

    await makePet(org.id, {
      name: 'Match',
      energy_level: 'LOW',
      independence_level: 'HIGH',
      environment: 'LARGE',
    })
    await makePet(org.id, { name: 'No match' })

    const { pets } = await sut.execute({
      city: 'Goiânia',
      page: 1,
      filters: {
        energy_level: 'LOW',
        independence_level: 'HIGH',
        environment: 'LARGE',
      },
    })

    expect(pets).toEqual([expect.objectContaining({ name: 'Match' })])
  })

  it('should be able to fetch paginated pets', async () => {
    const org = await createOrg('Goiânia')

    for (let i = 1; i <= 22; i++) {
      await makePet(org.id, { name: `Pet ${i}` })
    }

    const { pets } = await sut.execute({ city: 'Goiânia', page: 2 })

    expect(pets).toHaveLength(2)
    expect(pets).toEqual([
      expect.objectContaining({ name: 'Pet 21' }),
      expect.objectContaining({ name: 'Pet 22' }),
    ])
  })
})
