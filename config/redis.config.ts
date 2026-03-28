import Redis from "ioredis";

declare global {
    var redis: Redis | undefined;
}

export const redis =
    global.redis ||
    new Redis({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
        maxRetriesPerRequest: 1,
    });

if (process.env.NODE_ENV !== "production") {
    global.redis = redis;
}

redis.on("error", (err) => {
    console.error("Redis Error:", err.message);
});