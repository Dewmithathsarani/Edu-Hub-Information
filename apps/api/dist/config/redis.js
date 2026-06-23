"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
// @ts-ignore
const ioredis_mock_1 = __importDefault(require("ioredis-mock"));
const redisUrl = process.env.REDIS_URL;
// Use memory mock for local development if no URL provided
exports.redis = redisUrl
    ? new ioredis_1.default(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
            return Math.min(times * 50, 2000);
        },
    })
    : new ioredis_mock_1.default();
exports.redis.on('connect', () => {
    console.log('[Redis]: Connected successfully (Mock: ' + !redisUrl + ')');
});
exports.redis.on('error', (err) => {
    console.error('[Redis Error]:', err);
});
