import { FastifyInstance } from 'fastify';
import { prisma } from '../utils/prisma';
import { z } from 'zod';
import verifyAuth from '../middleware/middleware';
import { errorResponse } from '../utils/response';

export async function taskGroup(fastify: FastifyInstance) {
  fastify.get('/grouptask', { onRequest: [verifyAuth] }, async (req, res) => {
    const user = req.user;

    const groupTask = await prisma.taskGroup.findMany({
      where: {
        userId: user.sub,
      },
    });
    return groupTask;
  });

  fastify.post('/grouptask', { onRequest: [verifyAuth] }, async (req, res) => {
    const groupTaskSchema = z.object({
      name: z.string(),
      photo: z.string().nullable(),
    });

    const { name, photo } = groupTaskSchema.parse(req.body);

    if (name.trim().length < 3 || name.trim() == '') {
      return errorResponse('Inserir pelo menos 3 caracteres');
    }

    const user = req.user;

    await prisma.taskGroup.create({
      data: {
        name,
        photo,
        userId: user.sub,
      },
    });
    res.send().status(201);
  });

  fastify.put(
    '/grouptask/:id',
    { onRequest: [verifyAuth] },

    async (req, res) => {
      const groupTaskParamSchema = z.object({
        id: z.string(),
      });

      const { id } = groupTaskParamSchema.parse(req.params);

      const groupTaskSchema = z.object({
        name: z.string(),
        photo: z.string().nullable(),
      });

      const { name, photo } = groupTaskSchema.parse(req.body);
      await prisma.taskGroup.update({
        data: {
          name,
          photo,
        },
        where: {
          id,
        },
      });
      res.send().code(202);
    }
  );

  fastify.delete(
    '/grouptask/:id',
    { onRequest: [verifyAuth] },

    async (req, res) => {
      const groupTaskParamSchema = z.object({
        id: z.string(),
      });

      const { id } = groupTaskParamSchema.parse(req.params);

      await prisma.taskGroup.delete({
        where: {
          id,
        },
      });
      res.send().code(202);
    }
  );
}
