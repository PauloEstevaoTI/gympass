import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository";
import z from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { RegisterService } from "../services/register";
import { UserAlreadyExistsError } from "../services/errors/user-already-exists";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const userRepository = new PrismaUsersRepository();
    const registerService = new RegisterService(userRepository);

    await registerService.execute({
      name,
      email,
      password,
    });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({
        message: error.message,
      });
    }

    throw error;
  }

  return reply.status(201).send();
}
