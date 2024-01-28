const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const authorRouter = require("./controllers/authors");

const {
  errorHandler,
  unknowEndPoint,
  tokenExtractor,
  userExtractor,
  requestLogger,
} = require("./utils/middleware");
// const logger = require("./utils/logger");

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(tokenExtractor);

app.use("/api/login", loginRouter);
app.use("/api/blogs", userExtractor, blogsRouter);
app.use("/api/users", userExtractor, usersRouter);
app.use("/api/authors", userExtractor, authorRouter);

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

app.use(unknowEndPoint);
app.use(errorHandler);

module.exports = app;
