import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: null,
});

connection.on("connect", () => {
    console.log("✅ Redis connected");
});

connection.on("error", (err) => {
    console.error("❌ Redis error:", err);
});

export default connection;

//