const express = require("express");
const dataIngestionQueue = require("./utils/dataIngestionQueue");
const app = express();
const port = 9000;
const { testDbConnection } = require("./config/database");
const readExcelFile = require("./utils/excelFileParser");
testDbConnection();
// console.log(readExcelFile("./public/customer_data.xlsx"));
// Route to upload files and start the ingestion process
app.post("/ingest-data", (req, res) => {
  // Here, you'd get the file path of the uploaded Excel file. This might involve file upload logic.
  const filePath = "./public/customer_data.xlsx";

  dataIngestionQueue.add({ filePath });

  res.json({ message: "Data ingestion started" });
});

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);
