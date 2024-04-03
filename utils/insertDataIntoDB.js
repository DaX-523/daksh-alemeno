const Customer = require("../models/customer");

const insertDataIntoDatabase = async (data) => {
  for (const item of data) {
    try {
      await Customer.create({
        customer_id: item["Customer ID"],
        first_name: item["First Name"],
        last_name: item["Last Name"],
        age: item["Age"],
        phone_number: item["Phone Number"],
        monthly_salary: item["Monthly Salary"],
        approved_limit: item["Approved Limit"],
        current_debt: item["Current Debt"],
      });
    } catch (error) {
      console.error("Error inserting customer data:", error);
    }
  }
};

module.exports = insertDataIntoDatabase;
