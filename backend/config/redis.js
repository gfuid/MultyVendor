const redis = require('redis');
require('dotenv').config(); // Ensure dotenv is loaded

const redisClient = redis.createClient({
    // Agar REDIS_URL environment variable hai to use use kare, nahi to local pe jaye
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});

redisClient.on('error', (err) => console.log('❌ Redis Client Error:', err));

const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
            console.log('🚀 Redis Cloud Connected Successfully');
        }
    } catch (err) {
        console.log('❌ Redis Connection Failed:', err);
    }
};

module.exports = { redisClient, connectRedis };