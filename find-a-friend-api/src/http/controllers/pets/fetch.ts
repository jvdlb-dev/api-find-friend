import z from 'zod'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { makeFetchPetsByCityUseCase } from '@/use-cases/factories/make-fetch-pets-by-city-use-case'

export async function fetch(request: FastifyRequest, reply: FastifyReply) {
  const fetchPetsQuerySchema = z.object({
    city: z.string().trim().min(1, { error: 'City is required' }),
    page: z.coerce.number().min(1).default(1),
    age: z.enum(['PUPPY', 'ADULT', 'SENIOR']).optional(),
    size: z.enum(['SMALL', 'MEDIUM', 'LARGE']).optional(),
    energy_level: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    independence_level: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    environment: z.enum(['SMALL', 'MEDIUM', 'LARGE']).optional(),
  })

  const {
    city,
    page,
    age,
    size,
    energy_level,
    independence_level,
    environment,
  } = fetchPetsQuerySchema.parse(request.query)

  const fetchPetsByCityUseCase = makeFetchPetsByCityUseCase()

  const { pets } = await fetchPetsByCityUseCase.execute({
    city,
    page,
    filters: {
      ...(age && { age }),
      ...(size && { size }),
      ...(energy_level && { energy_level }),
      ...(independence_level && { independence_level }),
      ...(environment && { environment }),
    },
  })

  return reply.status(200).send({ pets })
}
