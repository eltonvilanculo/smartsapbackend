"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const prisma_1 = require("../utils/prisma");
const middleware_1 = __importDefault(require("../middleware/middleware"));
async function authRoutes(fastify) {
    fastify.get('/user', async (req, res) => {
        const token = 'ya29.a0AX9GBdUuEoY3TB7B98-bvaZF4G4wShHwzsJuLUEJ5HgXSdhXmLWs06TxwzxLfDb8Q4XIlhWX51RV-UYbwBgcErf_8GCgYbid5Av0HoYn9W4oqdRQavh5xJjs0hBtAZ83tx2Oyrd5WAFtCrlZt3qvCJ5ZIbWQwQaCgYKAeYSARMSFQHUCsbCY7PAWnYvcSFHS2rVjnqAzQ0165';
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        });
        const userInfo = await response.json();
        res.send(userInfo).code(200);
    });
    fastify.post('/login', async (req, res) => {
        const googleResponseSchema = zod_1.z.object({
            sub: zod_1.z.string(),
            name: zod_1.z.string(),
            picture: zod_1.z.string().url().nullable(),
            email: zod_1.z.string(),
        });
        const requestSchema = zod_1.z.object({
            access_token: zod_1.z.string(),
        });
        const { access_token } = requestSchema.parse(req.body);
        const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: 'Bearer ' + access_token,
            },
        });
        const userFromGoogleResponse = googleResponseSchema.parse(await googleResponse.json());
        let userChecker = await prisma_1.prisma.user.findUnique({
            where: {
                googleId: userFromGoogleResponse.sub,
            },
        });
        if (!userChecker) {
            userChecker = await prisma_1.prisma.user.create({
                data: {
                    name: userFromGoogleResponse.name,
                    email: userFromGoogleResponse.email,
                    googleId: userFromGoogleResponse.sub,
                    photo: userFromGoogleResponse.picture,
                },
            });
        }
        const userPayload = {
            name: userChecker.name,
            photo: userChecker.photo,
        };
        const token = fastify.jwt.sign(userPayload, {
            sub: userChecker.id,
            expiresIn: '7 days',
        });
        return { token };
    });
    fastify.get('/userinfo', { onRequest: [middleware_1.default] }, async (req) => {
        //req.jwtVerify();
        return req.user;
    });
}
exports.default = authRoutes;
