require("dotenv").config;
const Redis = require("ioredis");

const createRedisConnection = () => {
  return new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null, // BullMQ requires this to be null
  });
};

module.exports = createRedisConnection
