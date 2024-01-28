const logger = require("./logger");
const { User, Blog, Session } = require("../models");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../utils/config");

const requestLogger = (request, response, next) => {
  logger.info("Method", request.method);
  logger.info("Path", request.path);
  logger.info("Body", request.body);
  logger.info("---");
  next();
};

const unknowEndPoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError" && error.kind === "ObjectId") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({
      error: "invalid token",
    });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "token expired",
    });
  }

  logger.error(error.message);

  next(error);
};

//https://openclassrooms.com/en/courses/5614116-go-full-stack-with-node-js-express-and-mongodb/5656301-set-up-authentication-middleware
const tokenExtractor = (request, response, next) => {
  const authorization = request.headers.authorization;
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    const token = authorization.substring(7);
    request.token = token;
    request.decodedToken = jwt.verify(token, SECRET);
  }
  next();
};

const tokenValidator = async (request, response, next) => {
  console.log("tokenvalidatortokenvalidatortokenvalidatortokenvalidator");
  const token = request.token;
  console.log("token is: ", token);
  if (token) {
    const decodedTokenExisted = await Session.findOne({ where: { token: token } });
    console.log("decodedTokenExisted: ", decodedTokenExisted);
    if (!decodedTokenExisted) {
      console.log("token was invalid");
      return response.status(401).json({ error: "token invalid" });
    }
    console.log("token was ok");
    next();
  } else {
    console.log("token didnt exist");
    return response.status(401).json({ error: "token missing" });
  }
};

// const userExtractor = async (request, response, next) => {
//   if (request.decodedToken) {
//     const user = await User.findByPk(request.decodedToken.id);
//     request.user = user;
//   }
//   next();
// };
const userExtractor = async (request, response, next) => {
  if (request.token) {
    const decodedToken = jwt.verify(request.token, SECRET);
    // const user = await User.findById(decodedToken.id);
    const user = await User.findByPk(decodedToken.id);
    request.user = user;
  }
  next();
};

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id);
  if (!user.admin) {
    return res.status(401).json({ error: "operation not allowed" });
  }
  next();
};

const userFinderById = async (request, res, next) => {
  request.user = await User.findByPk(request.params.id, {
    include: { model: Blog, attributes: { exclude: ["userId"] } },
  });
  next();
};

module.exports = {
  requestLogger,
  unknowEndPoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
  isAdmin,
  userFinderById,
  tokenValidator,
};
