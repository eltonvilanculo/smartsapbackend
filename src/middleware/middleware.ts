import { FastifyRequest } from 'fastify';

export default async function verifyAuth(req: FastifyRequest) {
  await req.jwtVerify();
}
