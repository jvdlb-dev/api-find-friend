import { randomUUID } from 'crypto'
import type { Org, Prisma } from '../../../generated/prisma/browser'
import type { OrgsRepository } from '../orgs-repository'

export class InMemoryOrgsRepository implements OrgsRepository {
  public items: Org[] = []

  async findById(id: string) {
    const org = this.items.find((item) => item.id === id)
    if (!org) {
      return null
    }

    return org
  }

  async findByEmail(email: string) {
    const org = this.items.find((item) => item.email === email)
    if (!org) {
      return null
    }

    return org
  }

  async create(data: Prisma.OrgCreateInput) {
    const org = {
      id: data.id ?? randomUUID(),
      name: data.name,
      author_name: data.author_name,
      email: data.email,
      whatsapp: data.whatsapp,
      password_hash: data.password_hash,
      cep: data.cep,
      state: data.state,
      city: data.city,
      neighborhood: data.neighborhood,
      street: data.street,
      created_at: new Date(),
    }

    this.items.push(org)
    return org
  }
}
