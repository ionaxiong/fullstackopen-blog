require("dotenv").config();

// const PORT = process.env.PORT;
// const MONGODB_URL =
//   process.env.NODE_ENV === "test"
//     ? process.env.TEST_MONGODB_URL
//     : process.env.MONGODB_URL;
const PORT = process.env.PORT || 3003;
const DATABASE_URL = process.env.DATABASE_URL;
const SECRET = process.env.SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;

module.exports = {
  DATABASE_URL,
  PORT,
  SECRET,
  SESSION_SECRET,
};
