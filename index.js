const express = require("express");
const app = express();
const port = 9000;
const { testDbConnection, sq } = require("./config/database");
const ingestRoute = require("./routes/dataIngestion");
const userRoute = require("./routes/customer");
const loanRoute = require("./routes/loan");
const paymentRoute = require("./routes/payment");
const Customer = require("./models/customer");
const Loan = require("./models/loan");

async function syncModels() {
  try {
    // Sync the Customer model first to ensure the table is created
    await Customer.sync();
    console.log("Customers table created successfully.");

    // Then sync the Loan model
    await Loan.sync();
    console.log("Loans table created successfully.");
  } catch (error) {
    console.error("Failed to create tables:", error);
  }
}

async function startServer() {
  try {
    await syncModels();
    await sq.sync();
    require("./models/associations");

    console.log("Models synchronized with the database.");
    testDbConnection();

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use("/api/v1", ingestRoute);
    app.use("/api/v1", userRoute);
    app.use("/api/v1", loanRoute);
    app.use("/api/v1", paymentRoute);

    app.listen(port, () =>
      console.log(`App listening at http://localhost:${port}`)
    );
  } catch (error) {
    console.error("Failed to synchronize models with the database:", error);
  }
}

startServer();
