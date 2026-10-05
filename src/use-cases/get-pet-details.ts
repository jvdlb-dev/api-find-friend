import type { OrgsRepository } from '@/repositories/orgs-repository'
import type { PetsRepository } from '@/repositories/pets-repository'
import type { Org, Pet } from '../../generated/prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetPetDetailsUseCaseRequest {
  petId: string
}

interface GetPetDetailsUseCaseResponse {
  pet: Pet
  org: Org
}

export class GetPetDetailsUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private orgsRepository: OrgsRepository,
  ) {
    this.petsRepository = petsRepository
    this.orgsRepository = orgsRepository
  }

  async execute({
    petId,
  }: GetPetDetailsUseCaseRequest): Promise<GetPetDetailsUseCaseResponse> {
    const pet = await this.petsRepository.findById(petId)

    if (!pet) {
      throw new ResourceNotFoundError()
    }

    const org = await this.orgsRepository.findById(pet.org_id)

    if (!org) {
      throw new ResourceNotFoundError()
    }

    return {
      pet,
      org,
    }
  }
}
