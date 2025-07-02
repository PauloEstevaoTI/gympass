import { FastifyInstance } from "fastify";
import { register } from "./controllers/register";

export async function appRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    return { message: "Hello World!" }; // Example route
  });
  app.post("/users", register);
}
