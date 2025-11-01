import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL ?? 'redis://127.0.0.1:6379';

export const redisClient = createClient({
  url: redisUrl
});

redisClient.on('error', (err) => {
  console.warn('Redis Client Error', err);
});

(async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.warn('Could not connect to Redis at', redisUrl, '\nContinuing without Redis. Error: ', err);
  }
})();

export const isRedisConnected = () => {
  try {
    return Boolean(redisClient && redisClient.isOpen);
  } catch {
    return false;
  }
};

export default redisClient;
