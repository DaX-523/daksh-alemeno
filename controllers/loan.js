const Customer = require("../models/customer");
const Loan = require("../models/loan");
const {
  checkEligibility,
  calculateMonthlyPayment,
} = require("../utils/checkLoanEligibility");
const calculateSumCurrrentEMI = require("../utils/calculateSumCurrrentEMI");
const generateUniqueCustomerId = require("../utils/generateUniqueCustomerId");

exports.checkEligibilityAPI = async (req, res) => {
  try {
    const { customer_id, loan_amount, interest_rate, tenure } = req.body;
    const customer = await Customer.findByPk(customer_id);
    const creditScore = await checkEligibility(
      customer_id,
      customer.approved_limit
    );

    const sum_current_emis = await calculateSumCurrrentEMI(customer_id);
    let monthly_installment, corrected_interest_rate;
    console.log(creditScore, sum_current_emis, customer.monthly_salary);

    if (creditScore < 10 || sum_current_emis > 0.5 * customer.monthly_salary) {
      console.log("No loan");
      return res.status(200).json({
        ok: true,
        message: "Customer not eligible for loan.",
        customer_id,
        interest_rate,
        tenure,
        approval: false,
        corrected_interest_rate: null,
        monthly_installment: null,
      });
    } else if (50 > creditScore && creditScore >= 30) {
      corrected_interest_rate = 0.12;
      console.log("Approve loan @ 12%");
      monthly_installment = calculateMonthlyPayment(
        +loan_amount,
        corrected_interest_rate,
        +tenure
      );
      return res.status(200).json({
        ok: true,
        message: "Loan approved successfully at 12%",
        customer_id,
        interest_rate,
        tenure,
        approval: true,
        corrected_interest_rate,
        monthly_installment,
      });
    } else if (30 > creditScore && creditScore >= 10) {
      corrected_interest_rate = 0.16;
      console.log("Approve loan @ 16%");
      monthly_installment = calculateMonthlyPayment(
        +loan_amount,
        corrected_interest_rate,
        +tenure
      );
      return res.status(200).json({
        ok: true,
        message: "Loan approved successfully at 16%",
        customer_id,
        interest_rate,
        tenure,
        approval: true,
        corrected_interest_rate,
        monthly_installment,
      });
    } else if (creditScore >= 50) {
      corrected_interest_rate = interest_rate;

      console.log("Approve loan");
      monthly_installment = calculateMonthlyPayment(
        +loan_amount,
        +interest_rate,
        +tenure
      );
      return res.status(200).json({
        ok: true,
        message: "Loan approved successfully at " + interest_rate * 100 + "%",
        customer_id,
        interest_rate,
        tenure,
        approval: true,
        corrected_interest_rate,
        monthly_installment,
      });
    }
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};

exports.createLoan = async (req, res) => {
  try {
    const { customer_id, loan_amount, interest_rate, tenure } = req.body;
    const customer = await Customer.findByPk(customer_id);
    const creditScore = await checkEligibility(
      customer_id,
      customer.approved_limit
    );

    const sum_current_emis = await calculateSumCurrrentEMI(customer_id);
    let monthly_installment,
      corrected_interest_rate,
      newLoan,
      start_date,
      end_date;
    if (creditScore < 10 || sum_current_emis > 0.5 * +customer.monthly_salary) {
      return res.status(200).json({
        loan_id: null,
        customer_id,
        loan_approved: false,
        message: "Customer not eligible for loan.",
        monthly_installment: null,
      });
    } else if (50 > creditScore && creditScore >= 30) {
      corrected_interest_rate = 0.12;
      console.log("Create loan @ 12%");
      monthly_installment = Math.ceil(
        calculateMonthlyPayment(+loan_amount, corrected_interest_rate, +tenure)
      );
      start_date = new Date();

      end_date = new Date(start_date);
      end_date.setMonth(end_date.getMonth() + +tenure);
      newLoan = await Loan.create({
        loan_id: await generateUniqueCustomerId(),
        customer_id,
        loan_amount,
        tenure,
        interest_rate: corrected_interest_rate * 100,
        monthly_repayment: monthly_installment,
        emis_paid_on_time: 0,
        start_date,
        end_date,
      });
      return res.status(201).json({
        ok: true,
        loan_id: newLoan.loan_id,
        customer_id,
        loan_approved: true,
        message: "Loan Created successfully at 12%",
        monthly_installment,
      });
    } else if (30 > creditScore && creditScore >= 10) {
      corrected_interest_rate = 0.16;
      console.log("Create loan @ 16%");
      monthly_installment = Math.ceil(
        calculateMonthlyPayment(+loan_amount, corrected_interest_rate, +tenure)
      );
      start_date = new Date();

      end_date = new Date(start_date);
      end_date.setMonth(end_date.getMonth() + +tenure);
      newLoan = await Loan.create({
        loan_id: await generateUniqueCustomerId(),
        customer_id,
        loan_amount,
        tenure,
        interest_rate: corrected_interest_rate * 100,
        monthly_repayment: monthly_installment,
        emis_paid_on_time: 0,
        start_date,
        end_date,
      });
      return res.status(201).json({
        ok: true,
        loan_id: newLoan.loan_id,
        customer_id,

        loan_approved: true,
        message: "Loan Created successfully at 12%",
        monthly_installment,
      });
    } else if (creditScore >= 50) {
      corrected_interest_rate = interest_rate;

      console.log("Create loan");
      monthly_installment = Math.ceil(
        calculateMonthlyPayment(+loan_amount, +interest_rate, +tenure)
      );
      start_date = new Date();

      end_date = new Date(start_date);
      end_date.setMonth(end_date.getMonth() + +tenure);
      newLoan = await Loan.create({
        loan_id: await generateUniqueCustomerId(),
        customer_id,
        loan_amount,
        tenure,
        interest_rate: corrected_interest_rate * 100,
        monthly_repayment: monthly_installment,
        emis_paid_on_time: 0,
        start_date,
        end_date,
      });
      return res.status(201).json({
        ok: true,
        loan_id: newLoan.loan_id,
        customer_id,
        loan_approved: true,
        message: "Loan Created successfully at 12%",
        monthly_installment,
      });
    }
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};

exports.viewLoan = async (req, res) => {
  try {
    const { loan_id } = req.params;
    const loan = await Loan.findByPk(loan_id);
    if (!loan) return res.status(404).json("Resource Not found.");
    const customer = await Customer.findByPk(loan.customer_id);
    const { interest_rate, tenure } = loan;
    const { first_name, last_name, phone_number, age, id } = customer;
    return res.status(200).json({
      ok: true,
      loan_id: +loan_id,
      customer: {
        id,
        first_name,
        last_name,
        phone_number,
        age,
        id,
      },
      loan_approved: true,
      loan_amount: +loan.loan_amount,
      interest_rate,
      tenure,
      monthly_installment: +loan.monthly_repayment,
    });
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};
