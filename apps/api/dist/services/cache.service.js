"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheService = exports.CacheService = void 0;
const redis_1 = require("../config/redis");
class CacheService {
    async get(key) {
        try {
            const cached = await redis_1.redis.get(key);
            return cached ? JSON.parse(cached) : null;
        }
        catch (error) {
            console.error('Redis get error:', error);
            return null;
        }
    }
    async set(key, value, ttlSeconds) {
        try {
            const jitter = Math.floor(ttlSeconds * 0.1 * (Math.random() * 2 - 1));
            await redis_1.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds + jitter);
        }
        catch (error) {
            console.error('Redis set error:', error);
        }
    }
    async invalidate(pattern) {
        try {
            const keys = await redis_1.redis.keys(pattern);
            if (keys.length > 0) {
                await redis_1.redis.unlink(...keys);
            }
        }
        catch (error) {
            console.error('Redis invalidate error:', error);
        }
    }
}
exports.CacheService = CacheService;
exports.cacheService = new CacheService();
