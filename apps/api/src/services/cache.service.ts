import { redis } from '../config/redis';

export class CacheService {
  async get(key: string): Promise<any> {
    try {
      const cached = await redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds: number): Promise<void> {
    try {
      const jitter = Math.floor(ttlSeconds * 0.1 * (Math.random() * 2 - 1));
      await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds + jitter);
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  async invalidate(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.unlink(...keys);
      }
    } catch (error) {
      console.error('Redis invalidate error:', error);
    }
  }
}

export const cacheService = new CacheService();
