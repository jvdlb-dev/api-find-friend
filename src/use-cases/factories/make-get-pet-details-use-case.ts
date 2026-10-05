import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { GetPetDetailsUseCase } from '../get-pet-details'

export function makeGetPetDetailsUseCase(): GetPetDetailsUseCase {
  const petsRepository = new PrismaPetsRepository()
  const orgsRepository = new PrismaOrgsRepository()
  const useCase = new GetPetDetailsUseCase(petsRepository, orgsRepository)

  return useCase
}
