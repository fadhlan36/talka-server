"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const connection = new ioredis_1.default(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
});
connection.on("connect", () => {
    console.log("✅ Redis connected");
});
connection.on("error", (err) => {
    console.error("❌ Redis error:", err);
});
exports.default = connection;
//
