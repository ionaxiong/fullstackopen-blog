const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
require("express-async-errors");
const app = express();
const cors = require("cors");
const blogsRouter = require("./controllers/blogs");
const adminRouter = require("./controllers/admin");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const logoutRouter = require("./controllers/logout");
const authorRouter = require("./controllers/authors");
const readingListsRouter = require("./controllers/readingLists");
const { SESSION_SECRET } = require("./utils/config");

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
app.use(cookieParser());
app.use(session({ resave: true, secret: SESSION_SECRET, saveUninitialized: true }));
app.use(requestLogger);
app.use(tokenExtractor);

app.use("/api/login", loginRouter);
app.use("/api/logout", userExtractor, logoutRouter);
app.use("/api/blogs", userExtractor, blogsRouter);
app.use("/api/users", userExtractor, usersRouter);
app.use("/api/authors", userExtractor, authorRouter);
app.use("/api/readinglists", userExtractor, readingListsRouter);
app.use("/api/admin", userExtractor, adminRouter);

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

app.use(unknowEndPoint);
app.use(errorHandler);

module.exports = app;
