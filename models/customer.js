const { sq } = require("../config/database");

const { DataTypes } = require("sequelize");

const Customer = sq.define("customer", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  monthly_salary: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  approved_limit: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  current_debt: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

// Customer.sync()
//   .then(() => {
//     console.log("Customer model synced");
//   })
//   .catch((error) => {
//     console.log(error);
//   });

module.exports = Customer;
