const dataIngestionQueue = require("./dataIngestionQueue");
const readExcelFile = require("./excelFileParser");
const insertDataIntoDatabase = require("./insertDataIntoDB");

dataIngestionQueue.process(async (job, done) => {
  try {
    const { filePath } = job.data;
    const data = readExcelFile(filePath);
    await insertDataIntoDatabase(data);
    done();
  } catch (error) {
    console.error(error);
    done(new Error("Failed to process data ingestion"));
  }
});
