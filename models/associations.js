const Customer = require("./customer");
const Loan = require("./loan");

console.log("Establishing Associations");

Customer.hasMany(Loan, { foreignKey: "customer_id", as: "loans" });

Loan.belongsTo(Customer, { foreignKey: "customer_id", as: "customer" });
