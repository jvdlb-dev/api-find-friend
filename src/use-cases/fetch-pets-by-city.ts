import type { PetFilters, PetsRepository } from '@/repositories/pets-repository'
import type { Pet } from '../../generated/prisma/client'
import { CityIsRequiredError } from './errors/city-is-required-error'

interface FetchPetsByCityUseCaseRequest {
  city: string
  page: number
  filters?: PetFilters
}

interface FetchPetsByCityUseCaseResponse {
  pets: Pet[]
}

export class FetchPetsByCityUseCase {
  constructor(private petsRepository: PetsRepository) {
    this.petsRepository = petsRepository
  }

  async execute({
    city,
    page,
    filters = {},
  }: FetchPetsByCityUseCaseRequest): Promise<FetchPetsByCityUseCaseResponse> {
    if (!city || city.trim() === '') {
      throw new CityIsRequiredError()
    }

    const pets = await this.petsRepository.findManyByCity({
      city: city.trim(),
      page,
      filters,
    })

    return {
      pets,
    }
  }
}
