import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../utils/prisma";
import verifyAuth from "../middleware/middleware";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.get("/user", async (req, res) => {
    const token =
      "ya29.a0AX9GBdUuEoY3TB7B98-bvaZF4G4wShHwzsJuLUEJ5HgXSdhXmLWs06TxwzxLfDb8Q4XIlhWX51RV-UYbwBgcErf_8GCgYbid5Av0HoYn9W4oqdRQavh5xJjs0hBtAZ83tx2Oyrd5WAFtCrlZt3qvCJ5ZIbWQwQaCgYKAeYSARMSFQHUCsbCY7PAWnYvcSFHS2rVjnqAzQ0165";
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    const userInfo = await response.json();

    res.send(userInfo).code(200);
  });

  fastify.post("/login", async (req, res) => {
    const googleResponseSchema = z.object({
      sub: z.string(),
      name: z.string(),
      picture: z.string().url().nullable(),
      email: z.string(),
    });

    const requestSchema = z.object({
      access_token: z.string(),
    });

    const { access_token } = requestSchema.parse(req.body);

    const googleResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      }
    );

    const userFromGoogleResponse = googleResponseSchema.parse(
      await googleResponse.json()
    );

    let userChecker = await prisma.user.findUnique({
      where: {
        googleId: userFromGoogleResponse.sub,
      },
    });

    if (!userChecker) {
      userChecker = await prisma.user.create({
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
    console.log(
      "🚀 ~ file: auth.routes.ts:70 ~ fastify.post ~ userPayload",
      userPayload
    );

    const token = fastify.jwt.sign(userPayload, {
      sub: userChecker.id,
      expiresIn: "7 days",
    });
    console.log("🚀 ~ file: auth.routes.ts:79 ~ fastify.post ~ token", token);

    return { token };
  });

  fastify.get("/userinfo", { onRequest: [verifyAuth] }, async (req) => {
    //req.jwtVerify();

    return req.user;
  });

  fastify.get("/", async (req, res) => {
    return "working";
  });
}
