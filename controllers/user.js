const Customer = require("../models/customer");
const generateUniqueCustomerId = require("../utils/generateUniqueCustomerId");

exports.register = async (req, res) => {
  const { first_name, last_name, age, monthly_income, phone_number } = req.body;
  try {
    const approved_limit = 36 * +monthly_income;

    const customer_id = await generateUniqueCustomerId();
    console.log(customer_id);
    const newUser = await Customer.create({
      customer_id,
      first_name,
      last_name,
      age: +age,
      monthly_salary: +monthly_income,
      phone_number: phone_number,
      approved_limit,
      current_debt: 0,
    });
    console.log(newUser);
    return res.status(201).json({
      message: "Success",
      customer_id,
      name: newUser.first_name,
      age,
      monthly_income,
      approved_limit,
      phone_number,
    });
  } catch (error) {
    return res
      .status(422)
      .json({ message: "Failed to register user", error: error.message });
  }
};
