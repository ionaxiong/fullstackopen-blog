const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
const Blog = require("../models/blog");

const userFinder = async (request, res, next) => {
  console.log("request param username is : ", request.params.username);
  request.user = await User.findOne({ where: { username: request.params.username } });
  console.log("user found is : ", request.user);
  next();
};

usersRouter.get("/", async (request, response) => {
  const users = await User.findAll({
    include: { model: Blog, attributes: { exclude: ["userId"] } },
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

usersRouter.post("/", async (request, response) => {
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

usersRouter.get("/:id", async (request, response) => {
  const user = await User.findByPk(request.params.id);
  if (user) {
    response.json(user);
  } else {
    response.status(404).end();
  }
});

usersRouter.delete("/:id", async (request, response) => {
  await User.destroy({ where: { id: request.params.id } });
  response.status(204).end();
});

usersRouter.put("/:username", userFinder, async (request, response) => {
  console.log("hello world!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  if (request.user) {
    console.log("request user is : ", request.user);
    console.log("request user name is : ", request.user.name);
    const body = request.body;
    let newPasswordHash;

    if (body.password) {
      if (body.username.length < 3 || body.password.length < 3) {
        response.status(404).json({
          error: "username and password must be at least 3 characters long",
        });
      } else {
        const saltRounds = 10;
        newPasswordHash = await bcrypt.hash(body.password, saltRounds);
        console.log("password hash generated: ", newPasswordHash);
      }
    }

    request.user.passwordHash = newPasswordHash || request.user.passwordHash;
    request.user.name = body.name || request.user.name;
    request.user.username = body.username || request.user.username;

    const updatedUser = await request.user.save();

    console.log("updated user to: ", updatedUser);

    response.json(updatedUser);
  } else {
    response.status(404).end();
  }
});

module.exports = usersRouter;
