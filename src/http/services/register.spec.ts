import { RegisterService } from "./register";
import { test, expect, describe, it } from "vitest";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists";

// test("check if vitest is working", () => {
//   expect(2 + 2).toBe(4);
// });

// Unit tests

describe("Register User Case", () => {
  it("Should hash user password upon registration", async () => {
    const userRepository = new InMemoryUsersRepository();
    const registerService = new RegisterService(userRepository);

    const { user } = await registerService.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const isPasswordHashValid = await compare("123456", user.password_hash);

    expect(isPasswordHashValid).toBe(true);
  });

  it("Should not be able to register with same email twice", async () => {
    const userRepository = new InMemoryUsersRepository();
    const registerService = new RegisterService(userRepository);

    const email = "johndoe@example.com";

    await registerService.execute({
      name: "John Doe",
      email,
      password: "123456",
    });

    await expect(() =>
      registerService.execute({
        name: "John Doe",
        email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});

// const isPasswordHashValid = await compare("123456", user.password_hash);

// expect(isPasswordHashValid).toBe(true);
