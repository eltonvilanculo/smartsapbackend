"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const taskgroup_routes_1 = require("./routes/taskgroup.routes");
const tasks_routes_1 = require("./routes/tasks.routes");
(async () => {
    const fastify = (0, fastify_1.default)({
        logger: true,
    });
    fastify.register(jwt_1.default, {
        secret: 'nosecret',
    });
    fastify.register(auth_routes_1.default);
    fastify.register(taskgroup_routes_1.taskGroup);
    fastify.register(tasks_routes_1.tasks);
    fastify.listen({ port: 3000 });
})();
