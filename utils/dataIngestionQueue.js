const Queue = require("bull");
const dataIngestionQueue = new Queue("dataIngestion", "redis://127.0.0.1:6379");

module.exports = dataIngestionQueue;
