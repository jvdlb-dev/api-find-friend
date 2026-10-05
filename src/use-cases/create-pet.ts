import type { OrgsRepository } from '@/repositories/orgs-repository'
import type { PetsRepository } from '@/repositories/pets-repository'
import type {
  Pet,
  PetAge,
  PetEnergyLevel,
  PetEnvironment,
  PetIndependenceLevel,
  PetSize,
} from '../../generated/prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface CreatePetUseCaseRequest {
  name: string
  about: string | null
  age: PetAge
  size: PetSize
  energy_level: PetEnergyLevel
  independence_level: PetIndependenceLevel
  environment: PetEnvironment
  photos: string[]
  requirements: string[]
  org_id: string
}

interface CreatePetUseCaseResponse {
  pet: Pet
}

export class CreatePetUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private orgsRepository: OrgsRepository,
  ) {
    this.petsRepository = petsRepository
    this.orgsRepository = orgsRepository
  }

  async execute({
    name,
    about,
    age,
    size,
    energy_level,
    independence_level,
    environment,
    photos,
    requirements,
    org_id,
  }: CreatePetUseCaseRequest): Promise<CreatePetUseCaseResponse> {
    const org = await this.orgsRepository.findById(org_id)

    if (!org) {
      throw new ResourceNotFoundError()
    }

    const pet = await this.petsRepository.create({
      name,
      about,
      age,
      size,
      energy_level,
      independence_level,
      environment,
      photos,
      requirements,
      org_id,
    })

    return {
      pet,
    }
  }
}
