const config = require("./config");

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(config.DATABASE_URL);
console.log("Connecting to: ", config.DATABASE_URL);

const main = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.log("Unable to connect to the database:", error);
  }
};

main();

module.exports = sequelize;