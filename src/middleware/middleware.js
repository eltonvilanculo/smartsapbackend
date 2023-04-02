"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function verifyAuth(req) {
    await req.jwtVerify();
}
exports.default = verifyAuth;
