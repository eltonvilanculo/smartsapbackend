"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskGroup = void 0;
const prisma_1 = require("../utils/prisma");
const zod_1 = require("zod");
const middleware_1 = __importDefault(require("../middleware/middleware"));
const response_1 = require("../utils/response");
async function taskGroup(fastify) {
    fastify.get('/grouptask', { onRequest: [middleware_1.default] }, async (req, res) => {
        const user = req.user;
        const groupTask = await prisma_1.prisma.taskGroup.findMany({
            where: {
                userId: user.sub,
            },
        });
        return groupTask;
    });
    fastify.post('/grouptask', { onRequest: [middleware_1.default] }, async (req, res) => {
        const groupTaskSchema = zod_1.z.object({
            name: zod_1.z.string(),
            photo: zod_1.z.string().nullable(),
        });
        const { name, photo } = groupTaskSchema.parse(req.body);
        if (name.trim().length < 3 || name.trim() == '') {
            return (0, response_1.errorResponse)('Inserir pelo menos 3 caracteres');
        }
        const user = req.user;
        await prisma_1.prisma.taskGroup.create({
            data: {
                name,
                photo,
                userId: user.sub,
            },
        });
        res.send().status(201);
    });
    fastify.put('/grouptask/:id', { onRequest: [middleware_1.default] }, async (req, res) => {
        const groupTaskParamSchema = zod_1.z.object({
            id: zod_1.z.string(),
        });
        const { id } = groupTaskParamSchema.parse(req.params);
        const groupTaskSchema = zod_1.z.object({
            name: zod_1.z.string(),
            photo: zod_1.z.string().nullable(),
        });
        const { name, photo } = groupTaskSchema.parse(req.body);
        await prisma_1.prisma.taskGroup.update({
            data: {
                name,
                photo,
            },
            where: {
                id,
            },
        });
        res.send().code(202);
    });
    fastify.delete('/grouptask/:id', { onRequest: [middleware_1.default] }, async (req, res) => {
        const groupTaskParamSchema = zod_1.z.object({
            id: zod_1.z.string(),
        });
        const { id } = groupTaskParamSchema.parse(req.params);
        await prisma_1.prisma.taskGroup.delete({
            where: {
                id,
            },
        });
        res.send().code(202);
    });
}
exports.taskGroup = taskGroup;
