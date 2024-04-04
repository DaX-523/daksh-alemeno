const Loan = require("../models/loan");

exports.checkEligibility = async (req, res) => {
  const { customer_id, loan_amount, interest_rate, tenure } = req.body;
};

exports.createLoan = async (req, res) => {
  const { customer_id, loan_amount, interest_rate, tenure } = req.body;
};

exports.viewLoan = async (req, res) => {
  const { loan_id } = req.params;
};
