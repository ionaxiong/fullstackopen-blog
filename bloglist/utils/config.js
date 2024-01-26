require("dotenv").config();

// const PORT = process.env.PORT;
// const MONGODB_URL =
//   process.env.NODE_ENV === "test"
//     ? process.env.TEST_MONGODB_URL
//     : process.env.MONGODB_URL;
const PORT = process.env.PORT || 3003;
const DATABASE_URL = process.env.DATABASE_URL;

module.exports = {
  DATABASE_URL,
  PORT,
};
