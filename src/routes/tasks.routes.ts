import { FastifyInstance } from 'fastify';
import { prisma } from '../utils/prisma';
import { z } from 'zod';
import verifyAuth from '../middleware/middleware';
import { errorResponse } from '../utils/response';

export async function tasks(fastify: FastifyInstance) {
  fastify.get('/tasks', { onRequest: [verifyAuth] }, async (req, res) => {
    const user = req.user;
    const task = await prisma.task.findMany({
      select: {
        id: true,
        title: true,
      },
      where: {
        userId: user.sub,
      },
    });
  });

  fastify.post(
    '/tasks/:groupId',
    { onRequest: [verifyAuth] },
    async (req, res) => {
      const taskSchema = z.object({
        title: z.string(),
        description: z.string().nullable(),
        startAt: z.date().default(new Date()),
        endAt: z.date().default(new Date()),
      });

      const groupTaskParamSchema = z.object({
        groupId: z.string(),
      });

      const user = req.user;

      const { groupId } = groupTaskParamSchema.parse(req.params);

      const { title, description, startAt, endAt } = taskSchema.parse(req.body);
      await prisma.task.create({
        data: {
          title,
          description,
          startAt,
          endAt,
          groupId,
          userId: user.sub,
        },
      });
    }
  );

  fastify.put(
    '/tasks/:id',
    { onRequest: [verifyAuth] },
    async (req, res) => {}
  );

  fastify.delete(
    '/tasks/:id',
    { onRequest: [verifyAuth] },

    async (req, res) => {}
  );
}
