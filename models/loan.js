const { sq } = require("../config/database");

const { DataTypes } = require("sequelize");

const Loan = sq.define("loan", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  loan_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "customers",
      key: "id",
    },
  },
  loan_amount: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  tenure: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  interest_rate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  monthly_repayment: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  emis_paid_on_time: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});

// Loan.sync()
//   .then(() => {
//     console.log("Loan model synced");
//   })
//   .catch((error) => {
//     console.log(error);
//   });

module.exports = Loan;
