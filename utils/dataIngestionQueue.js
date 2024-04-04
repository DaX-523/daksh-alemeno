const Queue = require("bull");
const dataIngestionQueue = new Queue("dataIngestion", "redis://127.0.0.1:6379");
const redis = require("redis");
const client = redis.createClient({ url: "redis://localhost:6379" });

client.connect();

client.on("error", (err) => console.error("Redis connection error:", err));
client.on("connect", () => console.log("Connected to Redis successfully"));

module.exports = dataIngestionQueue;
