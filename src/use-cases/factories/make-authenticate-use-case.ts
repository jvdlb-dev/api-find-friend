import { AuthenticateUseCase } from '../authenticate'
import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'

export function makeAuthenticateUseCase(): AuthenticateUseCase {
  const orgsRepository = new PrismaOrgsRepository()
  const authenticateUseCase = new AuthenticateUseCase(orgsRepository)

  return authenticateUseCase
}
