import Redis from 'ioredis';
// @ts-ignore
import RedisMock from 'ioredis-mock';

const redisUrl = process.env.REDIS_URL;

// Use memory mock for local development if no URL provided
export const redis = redisUrl 
  ? new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        return Math.min(times * 50, 2000);
      },
    })
  : new RedisMock();

redis.on('connect', () => {
  console.log('[Redis]: Connected successfully (Mock: ' + !redisUrl + ')');
});

redis.on('error', (err: any) => {
  console.error('[Redis Error]:', err);
});
