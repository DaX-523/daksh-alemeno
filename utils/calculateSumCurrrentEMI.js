const { Sequelize } = require("sequelize");
const Loan = require("../models/loan");

const calculateSumCurrrentEMI = async (customer_id) => {
  const current_emis = await Loan.findAll({
    where: {
      tenure: {
        [Sequelize.Op.ne]: Sequelize.col("emis_paid_on_time"), // tenure is not equal to emis_paid_on_time
      },
      customer_id,
      end_date: {
        [Sequelize.Op.gt]: new Date(), // end_date is greater than the current date
      },
    },
  });

  return current_emis.reduce(
    (sum, current) => sum + +current.monthly_repayment,
    0
  );
};

module.exports = calculateSumCurrrentEMI;
