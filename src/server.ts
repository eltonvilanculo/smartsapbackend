import Fastify from "fastify";
import authRoutes from "./routes/auth.routes";
import fastifyJwt from "@fastify/jwt";
import { taskGroup } from "./routes/taskgroup.routes";
import { tasks } from "./routes/tasks.routes";

(async () => {
  const fastify = Fastify({
    logger: true,
  });

  fastify.register(fastifyJwt, {
    secret: "nosecret",
  });

  fastify.register(authRoutes);
  fastify.register(taskGroup);
  fastify.register(tasks);

  fastify.listen({ port: 3000, host: "0.0.0.0" });
})();
