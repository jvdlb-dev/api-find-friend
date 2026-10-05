import z from 'zod'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { makeGetPetDetailsUseCase } from '@/use-cases/factories/make-get-pet-details-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export async function details(request: FastifyRequest, reply: FastifyReply) {
  const detailsParamsSchema = z.object({
    petId: z.uuid(),
  })

  const { petId } = detailsParamsSchema.parse(request.params)

  try {
    const getPetDetailsUseCase = makeGetPetDetailsUseCase()

    const { pet, org } = await getPetDetailsUseCase.execute({ petId })

    return reply.status(200).send({
      pet,
      org: {
        ...org,
        password_hash: undefined,
      },
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    throw err
  }
}
