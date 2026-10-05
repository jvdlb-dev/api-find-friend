import type { OrgsRepository } from '@/repositories/orgs-repository'
import { hash } from 'bcryptjs'
import { OrgAlreadyExistsError } from './errors/org-already-exists-error'
import type { Org } from '../../generated/prisma/client'

interface RegisterOrgUseCaseRequest {
  name: string
  author_name: string
  email: string
  password: string
  whatsapp: string
  cep: string
  state: string
  city: string
  neighborhood: string
  street: string
}

interface RegisterOrgUseCaseResponse {
  org: Org
}

export class RegisterOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) {
    this.orgsRepository = orgsRepository
  }

  async execute({
    name,
    author_name,
    email,
    password,
    whatsapp,
    cep,
    state,
    city,
    neighborhood,
    street,
  }: RegisterOrgUseCaseRequest): Promise<RegisterOrgUseCaseResponse> {
    const password_hash = await hash(password, 6)

    const orgWithSameEmail = await this.orgsRepository.findByEmail(email)

    if (orgWithSameEmail) {
      throw new OrgAlreadyExistsError()
    }

    const org = await this.orgsRepository.create({
      name,
      author_name,
      email,
      password_hash,
      whatsapp,
      cep,
      state,
      city,
      neighborhood,
      street,
    })

    return {
      org,
    }
  }
}
