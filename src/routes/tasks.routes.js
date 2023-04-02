"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tasks = void 0;
const prisma_1 = require("../utils/prisma");
const zod_1 = require("zod");
const middleware_1 = __importDefault(require("../middleware/middleware"));
async function tasks(fastify) {
    fastify.get('/tasks', { onRequest: [middleware_1.default] }, async (req, res) => {
        const user = req.user;
        const task = await prisma_1.prisma.task.findMany({
            select: {
                id: true,
                title: true,
            },
            where: {
                userId: user.sub,
            },
        });
    });
    fastify.post('/tasks/:groupId', { onRequest: [middleware_1.default] }, async (req, res) => {
        const taskSchema = zod_1.z.object({
            title: zod_1.z.string(),
            description: zod_1.z.string().nullable(),
            startAt: zod_1.z.date().default(new Date()),
            endAt: zod_1.z.date().default(new Date()),
        });
        const groupTaskParamSchema = zod_1.z.object({
            groupId: zod_1.z.string(),
        });
        const user = req.user;
        const { groupId } = groupTaskParamSchema.parse(req.params);
        const { title, description, startAt, endAt } = taskSchema.parse(req.body);
        await prisma_1.prisma.task.create({
            data: {
                title,
                description,
                startAt,
                endAt,
                groupId,
                userId: user.sub,
            },
        });
    });
    fastify.put('/tasks/:id', { onRequest: [middleware_1.default] }, async (req, res) => { });
    fastify.delete('/tasks/:id', { onRequest: [middleware_1.default] }, async (req, res) => { });
}
exports.tasks = tasks;
