import "@fastify/jwt";
declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      name: string;
      photo: string;
      sub: string;
    };
  }
}
