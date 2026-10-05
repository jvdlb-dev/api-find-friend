import z from 'zod'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { makeCreatePetUseCase } from '@/use-cases/factories/make-create-pet-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createPetBodySchema = z.object({
    name: z.string().min(1),
    about: z.string().nullable().default(null),
    age: z.enum(['PUPPY', 'ADULT', 'SENIOR']),
    size: z.enum(['SMALL', 'MEDIUM', 'LARGE']),
    energy_level: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    independence_level: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    environment: z.enum(['SMALL', 'MEDIUM', 'LARGE']),
    photos: z.array(z.string()).default([]),
    requirements: z.array(z.string()).default([]),
  })

  const {
    name,
    about,
    age,
    size,
    energy_level,
    independence_level,
    environment,
    photos,
    requirements,
  } = createPetBodySchema.parse(request.body)

  try {
    const createPetUseCase = makeCreatePetUseCase()

    const { pet } = await createPetUseCase.execute({
      name,
      about,
      age,
      size,
      energy_level,
      independence_level,
      environment,
      photos,
      requirements,
      org_id: request.user.sub,
    })

    return reply.status(201).send({ pet })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    throw err
  }
}
