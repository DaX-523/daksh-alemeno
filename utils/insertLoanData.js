const Loan = require("../models/loan");

const insertLoanData = async (data) => {
  for (const item of data) {
    try {
      await Loan.create({
        loan_id: item["Loan ID"],
        customer_id: item["Customer ID"],
        loan_amount: item["Loan Amount"],
        tenure: item["Tenure"],
        interest_rate: item["Interest Rate"],
        monthly_repayment: item["Monthly payment"],
        emis_paid_on_time: item["EMIs paid on Time"],
        start_date: item["Date of Approval"],
        end_date: item["End Date"],
      });
    } catch (error) {
      console.error("Error inserting loan data:", error);
    }
  }
};

module.exports = insertLoanData;
