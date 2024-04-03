const { Sequelize } = require("sequelize");

require("dotenv").config();

const sequelize = new Sequelize(process.env.DEV_DATABASE_URL);
const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to DB established!");
  } catch (error) {
    console.log("Connection to DB failed!", error);
  }
};

module.exports = { sq: sequelize, testDbConnection };
