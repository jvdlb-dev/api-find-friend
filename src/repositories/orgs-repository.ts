import type { Org, Prisma } from '../../generated/prisma/client'

export interface OrgsRepository {
  findById: (id: string) => Promise<Org | null>
  findByEmail: (email: string) => Promise<Org | null>
  create: (data: Prisma.OrgCreateInput) => Promise<Org>
}
