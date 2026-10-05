import 'dotenv/config'
import { PrismaClient } from '../../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { env } from '@/env'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não foi definida no .env')
}

// O adapter do pg não lê o "?schema=" da URL sozinho, então passamos
// explicitamente (necessário para o isolamento de schema dos testes e2e).
const schema =
  new URL(process.env.DATABASE_URL).searchParams.get('schema') ?? 'public'

const adapter = new PrismaPg(
  { connectionString: process.env.DATABASE_URL },
  { schema },
)

export const prisma = new PrismaClient({
  adapter,
  log: env.NODE_ENV === 'development' ? ['query'] : [],
})
