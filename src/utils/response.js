"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = void 0;
function errorResponse(msg) {
    return {
        error: msg,
    };
}
exports.errorResponse = errorResponse;
