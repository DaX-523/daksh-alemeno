const dataIngestionQueue = require("../utils/dataIngestionQueue");
const readExcelFile = require("../utils/excelFileParser");
const insertDataIntoDatabase = require("../utils/insertDataIntoDB");
const insertLoanData = require("../utils/insertLoanData");

async function processCustomerData(filePath) {
  try {
    const customerData = await readExcelFile(filePath);
    await insertDataIntoDatabase(customerData);
  } catch (error) {
    console.error("Error processing customer data:", error);
    throw error; // Rethrow to be caught in the dataIngestionQueue.process
  }
}

async function processLoanData(filePath) {
  try {
    const loanData = await readExcelFile(filePath);
    await insertLoanData(loanData);
  } catch (error) {
    console.error("Error processing loan data:", error);
    throw error; // Rethrow to be caught in the dataIngestionQueue.process
  }
}

exports.ingest = (req, res) => {
  // const insertDataIntoDatabase = require("../utils/insertDataIntoDB");
  // const insertLoanData = require("../utils/insertLoanData");
  // Adding a job to ingest customer data
  dataIngestionQueue.add({
    type: "customer",
    filePath: "./public/customer_data.xlsx",
  });

  // Adding a job to ingest loan data
  dataIngestionQueue.add({
    type: "loan",
    filePath: "./public/loan_data.xlsx",
  });
  dataIngestionQueue.process(async (job, done) => {
    try {
      const { type, filePath } = job.data;

      if (type === "customer") {
        await processCustomerData(filePath);
      } else if (type === "loan") {
        await processLoanData(filePath);
      } else {
        throw new Error(`Unsupported job type: ${type}`);
      }

      done();
    } catch (error) {
      console.error("Error in data ingestion process:", error);
      done(new Error("Failed to process data ingestion"));
    }
  });

  res.json({ message: "Data ingestion started" });
};
