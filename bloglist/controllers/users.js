const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const { errorHandler, isAdmin, tokenExtractor, userFinderById } = require("../utils/middleware");
const { Team, Blog, User } = require("../models");

const userFinderByUsername = async (request, res, next) => {
  console.log("request param username is : ", request.params.username);
  request.user = await User.findOne({
    where: { username: request.params.username },
  });
  console.log("user found is : ", request.user);
  next();
};

usersRouter.get("/", errorHandler, async (request, response) => {
  const users = await User.findAll({
    include: [
      { model: Blog, attributes: { exclude: ["userId"] } },
      {
        model: Blog,
        as: "marked_blogs",
        attributes: { exclude: ["userId"] },
        through: { attributes: [] },
        include: { model: User, attributes: ["name"] },
      },
      { model: Team, attributes: ["name", "id"], through: { attributes: [] } },
    ],
  });
  response.json(users);
  // const users = await User.find({}).populate("blogs", {
  //   author: 1,
  //   title: 1,
  //   url: 1,
  //   likes: 1,
  // });
  // console.log(users);
  // response.json(users);
});

usersRouter.get("/:id", errorHandler, async (request, response) => {
  const user = await User.findByPk(request.params.id, {
    attributes: ["name", "username"],
    include: [
      {
        model: Blog,
        as: "readings",
        attributes: { exclude: ["createdAt", "updatedAt", "userId"] },
        through: { attributes: ["id", "read"] },
      },
    ],
  });

  response.json(user);

  // if (request.user) {
  //   response.json(request.user);
  // } else {
  //   response.status(404).end();
  // }
});

usersRouter.post("/", errorHandler, async (request, response) => {
  // const user = await User.create(request.body);
  const body = request.body;
  console.log(body);
  const saltRounds = 10;

  if (body.username.length < 3 || body.password.length < 3) {
    response.status(404).json({
      error: "username and password must be at least 3 characters long",
    });
  } else {
    const passwordHash = await bcrypt.hash(body.password, saltRounds);
    console.log("password hash generated: ", passwordHash);

    const newUser = await User.create({
      username: body.username,
      name: body.name,
      passwordHash: passwordHash,
    });

    console.log("new user created: ", newUser);

    response.json(newUser);
  }

  // const body = request.body;

  // const saltRounds = 10;

  // if (body.username.length < 3 || body.password.length < 3) {
  //   response
  //     .status(404)
  //     .json({
  //       error: "username and password must be at least 3 characters long",
  //     });
  // } else {
  //   const passwordHash = await bcrypt.hash(body.password, saltRounds);

  //   const user = new User({
  //     username: body.username,
  //     name: body.name,
  //     passwordHash,
  //   });

  //   const savedUser = await user.save();

  //   response.json(savedUser);
  // }
});

usersRouter.delete("/:id", errorHandler, async (request, response) => {
  await User.destroy({ where: { id: request.params.id } });
  response.status(204).end();
});

// usersRouter.put("/:username", userFinderByUsername, errorHandler, async (request, response) => {
//   if (request.user) {
//     const body = request.body;
//     let newPasswordHash;

//     if (body.password) {
//       if (body.username.length < 3 || body.password.length < 3) {
//         response.status(404);
//       } else {
//         const saltRounds = 10;
//         newPasswordHash = await bcrypt.hash(body.password, saltRounds);
//       }
//     }

//     request.user.passwordHash = newPasswordHash || request.user.passwordHash;
//     request.user.name = body.name || request.user.name;
//     request.user.username = body.username || request.user.username;

//     const updatedUser = await request.user.save();

//     response.json(updatedUser);
//   } else {
//     response.status(404).end();
//   }
// });

usersRouter.put(
  "/:username",
  userFinderByUsername,
  tokenExtractor,
  isAdmin,
  errorHandler,
  async (request, response) => {
    // const user = await User.findOne({
    //   where: {
    //     username: request.params.username,
    //   },
    // });

    if (request.user) {
      request.user.disabled = request.body.disabled;
      await request.user.save();
      response.json(request.user);
    } else {
      response.status(404).end();
    }
  }
);

module.exports = usersRouter;
