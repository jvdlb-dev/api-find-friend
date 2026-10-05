import type {
  Pet,
  PetAge,
  PetEnergyLevel,
  PetEnvironment,
  PetIndependenceLevel,
  PetSize,
  Prisma,
} from '../../generated/prisma/client'

export interface PetFilters {
  age?: PetAge
  size?: PetSize
  energy_level?: PetEnergyLevel
  independence_level?: PetIndependenceLevel
  environment?: PetEnvironment
}

export interface FindManyByCityParams {
  city: string
  page: number
  filters: PetFilters
}

export interface PetsRepository {
  findById: (id: string) => Promise<Pet | null>
  findManyByCity: (params: FindManyByCityParams) => Promise<Pet[]>
  create: (data: Prisma.PetUncheckedCreateInput) => Promise<Pet>
}
