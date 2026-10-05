import { randomUUID } from 'crypto'
import type { Pet, Prisma } from '../../../generated/prisma/browser'
import type { FindManyByCityParams, PetsRepository } from '../pets-repository'
import type { InMemoryOrgsRepository } from './in-memory-orgs-repository'

function toArray(value?: string[] | { set: string[] }) {
  if (!value) {
    return []
  }

  return Array.isArray(value) ? value : value.set
}

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

  // eslint-disable-next-line no-useless-constructor
  constructor(private orgsRepository: InMemoryOrgsRepository) {}

  async findById(id: string) {
    const pet = this.items.find((item) => item.id === id)
    if (!pet) {
      return null
    }

    return pet
  }

  async findManyByCity({ city, page, filters }: FindManyByCityParams) {
    const orgsIdsInCity = this.orgsRepository.items
      .filter((org) => org.city.toLowerCase() === city.toLowerCase())
      .map((org) => org.id)

    return this.items
      .filter((item) => orgsIdsInCity.includes(item.org_id))
      .filter((item) => (filters.age ? item.age === filters.age : true))
      .filter((item) => (filters.size ? item.size === filters.size : true))
      .filter((item) =>
        filters.energy_level
          ? item.energy_level === filters.energy_level
          : true,
      )
      .filter((item) =>
        filters.independence_level
          ? item.independence_level === filters.independence_level
          : true,
      )
      .filter((item) =>
        filters.environment ? item.environment === filters.environment : true,
      )
      .slice((page - 1) * 20, page * 20)
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = {
      id: data.id ?? randomUUID(),
      name: data.name,
      about: data.about ?? null,
      age: data.age,
      size: data.size,
      energy_level: data.energy_level,
      independence_level: data.independence_level,
      environment: data.environment,
      photos: toArray(data.photos),
      requirements: toArray(data.requirements),
      org_id: data.org_id,
      created_at: new Date(),
    }

    this.items.push(pet)
    return pet
  }
}
