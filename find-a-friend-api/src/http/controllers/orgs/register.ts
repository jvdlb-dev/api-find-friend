import z from 'zod'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { OrgAlreadyExistsError } from '@/use-cases/errors/org-already-exists-error'
import { makeRegisterOrgUseCase } from '@/use-cases/factories/make-register-org-use-case'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string().min(1),
    author_name: z.string().min(1),
    email: z.email({ error: 'Invalid email address' }),
    password: z.string().min(6),
    whatsapp: z
      .string()
      .regex(/^\d{10,13}$/, { error: 'Invalid whatsapp number' }),
    cep: z.string().min(1),
    state: z.string().min(1),
    city: z.string().min(1),
    neighborhood: z.string().min(1),
    street: z.string().min(1),
  })

  const {
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
  } = registerBodySchema.parse(request.body)

  try {
    const registerOrgUseCase = makeRegisterOrgUseCase()

    await registerOrgUseCase.execute({
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
    })
  } catch (err) {
    if (err instanceof OrgAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    throw err
  }
  return reply.status(201).send()
}
