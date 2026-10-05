import { prisma } from '@/lib/prisma'
import type { Prisma } from '../../../generated/prisma/client'
import type { FindManyByCityParams, PetsRepository } from '../pets-repository'

export class PrismaPetsRepository implements PetsRepository {
  async findById(id: string) {
    const pet = await prisma.pet.findUnique({
      where: {
        id,
      },
    })

    return pet
  }

  async findManyByCity({ city, page, filters }: FindManyByCityParams) {
    const where: Prisma.PetWhereInput = {
      org: {
        city: {
          equals: city,
          mode: 'insensitive',
        },
      },
    }

    if (filters.age) where.age = filters.age
    if (filters.size) where.size = filters.size
    if (filters.energy_level) where.energy_level = filters.energy_level
    if (filters.independence_level) {
      where.independence_level = filters.independence_level
    }
    if (filters.environment) where.environment = filters.environment

    const pets = await prisma.pet.findMany({
      where,
      skip: (page - 1) * 20,
      take: 20,
    })

    return pets
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = await prisma.pet.create({
      data,
    })

    return pet
  }
}
