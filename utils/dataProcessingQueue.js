const dataIngestionQueue = require("./dataIngestionQueue");
const readExcelFile = require("./excelFileParser");
const insertDataIntoDatabase = require("./insertDataIntoDB");

dataIngestionQueue.on("error", (err) => {
  console.error("Queue encountered an error:", err);
});

dataIngestionQueue.on("waiting", (jobId) => {
  console.log(`Job with ID ${jobId} is waiting`);
});

dataIngestionQueue.on("active", (job, jobPromise) => {
  console.log(`Job with ID ${job.id} is now active`);
});

dataIngestionQueue.on("completed", (job, result) => {
  console.log(`Job with ID ${job.id} has completed with result:`, result);
});

dataIngestionQueue.on("failed", (job, err) => {
  console.error(`Job with ID ${job.id} has failed with error:`, err);
});

dataIngestionQueue.process(async (job, done) => {
  try {
    const { filePath } = job.data;
    console.log("fp", filePath);
    const data = readExcelFile(filePath);
    await insertDataIntoDatabase(data);
    done();
  } catch (error) {
    console.error(error);
    done(new Error("Failed to process data ingestion"));
  }
});
