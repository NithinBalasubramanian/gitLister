"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRedisConnected = exports.redisClient = void 0;
const redis_1 = require("redis");
const redisUrl = process.env.REDIS_URL ?? 'redis://127.0.0.1:6379';
exports.redisClient = (0, redis_1.createClient)({
    url: redisUrl
});
exports.redisClient.on('error', (err) => {
    console.warn('Redis Client Error', err);
});
(async () => {
    try {
        await exports.redisClient.connect();
        console.log('Connected to Redis');
    }
    catch (err) {
        console.warn('Could not connect to Redis at', redisUrl, '\nContinuing without Redis. Error: ', err);
    }
})();
const isRedisConnected = () => {
    try {
        return Boolean(exports.redisClient && exports.redisClient.isOpen);
    }
    catch {
        return false;
    }
};
exports.isRedisConnected = isRedisConnected;
exports.default = exports.redisClient;
