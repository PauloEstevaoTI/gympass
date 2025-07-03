import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists";
import { User } from "@prisma/client";

interface RegisterServiceRequest {
  name: string; // User's name
  email: string; // User's email
  password: string; // User's password
}

interface RegisterServiceResponse {
  user: User;
}

// SOLID principle: Single Responsibility Principle

// Dependency Inversion Principle: This function depends on an abstraction (PrismaUsersRepository) rather than a concrete implementation (prisma directly).

export class RegisterService {
  private usersRepository: UsersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  async execute({
    name,
    email,
    password,
  }: RegisterServiceRequest): Promise<RegisterServiceResponse> {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    });

    return {
      user,
    };
  }
}
