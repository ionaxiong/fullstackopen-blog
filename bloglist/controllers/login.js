const jwt = require("jsonwebtoken");
const loginRouter = require("express").Router();
const { errorHandler } = require("../utils/middleware");

const { SECRET } = require("../utils/config");
const bcrypt = require("bcrypt");
const { Session, User } = require("../models");

loginRouter.post("/", errorHandler, async (request, response) => {
  const body = request.body;

  const user = await User.findOne({ where: { username: body.username } });

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(body.password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  if (user.disabled) {
    return response.status(401).json({
      error: "account disabled, please contact admin",
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);

  const newSession = await Session.create({
    token,
    userId: user.id,
  });

  await newSession.save();

  response.status(200).send({ token, username: user.username, name: user.name });

  // const user = await User.findOne({ username: body.username });
  // const passwordCorrect =
  //   user === null ? false : await bcrypt.compare(body.password, user.passwordHash);

  // if (!(user && passwordCorrect)) {
  //   return response.status(401).json({
  //     error: "invalid username or password",
  //   });
  // }

  // const userForToken = {
  //   username: user.username,
  //   id: user._id,
  // };

  // const token = jwt.sign(userForToken, process.env.SECRET, {
  //   expiresIn: 60 * 60,
  // });

  // response.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
