const Customer = require("../models/customer");
const Loan = require("../models/loan");

exports.makePayment = async (req, res) => {
  try {
    const { customer_id, loan_id } = req.params;
    const { paymentAmount } = req.body;
    const customer = await Customer.findByPk(customer_id);
    if (!customer) return res.status(404).json("Customer Not found.");
    const loan = await Loan.findByPk(loan_id);
    if (!loan) return res.status(404).json("Loan data Not found.");
    loan.emis_paid_on_time += 1;
    // monthly_repayment - payment made will get added to current_debt if positive and will get additioned to monthly_repayment
    // if negative still get additioned to monthly_repayment but not to current_debt
    if (+paymentAmount !== +loan.monthly_repayment) {
      let difference = +loan.monthly_repayment - +paymentAmount;
      if (difference > 0) {
        customer.current_debt = +customer.current_debt + Math.abs(difference);
        await customer.save();
      }
      loan.monthly_repayment = +loan.monthly_repayment + Math.abs(difference);
    }
    await loan.save();
    return res.status(200).json({
      ok: true,
      message: "Payment made.",
      paymentAmount,
      emis_paid_on_time: loan.emis_paid_on_time,
      current_debt: customer.current_debt,
      monthly_repayment: loan.monthly_repayment,
    });
  } catch (error) {
    return res
      .status(409)
      .json({ error: "Payment conflicts with current loan state" });
  }
};

exports.viewStatement = async (req, res) => {
  try {
    const { customer_id, loan_id } = req.params;
    const customer = await Customer.findByPk(customer_id);
    if (!customer) return res.status(404).json("Customer Not found.");
    const loan = await Loan.findByPk(loan_id);
    if (!loan) return res.status(404).json("Loan data Not found.");
    let amount_paid = +loan.emis_paid_on_time * +loan.monthly_repayment;
    let repayments_left = +loan.tenure - +loan.emis_paid_on_time;
    return res.status(200).json({
      ok: true,
      customer_id: +customer_id,
      loan_id: +loan_id,
      principal: +loan.loan_amount,
      interest_rate: loan.interest_rate,
      amount_paid,
      monthly_installment: +loan.monthly_repayment,
      repayments_left,
    });
  } catch (error) {
    return res.status(400).json({ error: "Bad request" });
  }
};
