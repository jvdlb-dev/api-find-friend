import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { FetchPetsByCityUseCase } from '../fetch-pets-by-city'

export function makeFetchPetsByCityUseCase(): FetchPetsByCityUseCase {
  const petsRepository = new PrismaPetsRepository()
  const useCase = new FetchPetsByCityUseCase(petsRepository)

  return useCase
}
