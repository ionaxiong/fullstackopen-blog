const logoutRouter = require("express").Router();
const { Session } = require("../models");

const {
  errorHandler,
  tokenExtractor,
  tokenValidator,
  userExtractor,
} = require("../utils/middleware");

logoutRouter.delete(
  "/",
  errorHandler,
  tokenExtractor,
  tokenValidator,
  userExtractor,
  async (request, response) => {
    const token = request.token;

    await Session.destroy({
      where: {
        token,
      },
    });

    response.status(204).end();
  }
);

module.exports = logoutRouter;
