const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const { tokenExtractor, errorHandler, tokenValidator } = require("../utils/middleware");
const { Op } = require("sequelize");
// const jwt = require("jsonwebtoken");
// const { SECRET } = require("../utils/config");

const blogFinder = async (request, res, next) => {
  request.blog = await Blog.findByPk(request.params.id, {
    include: { model: User, attributes: ["name"] },
    attributes: { exclude: ["userId"] },
  });
  next();
};

// const tokenExtractor = (request, response) => {
//   const authorization = request.get("authorization");
//   if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
//     try {
//       request.decodedToken = jwt.verify(authorization.substring(7), SECRET);
//     } catch (error) {
//       return response.status(401).json({ error: "token invalid" });
//     }
//   } else {
//     return response.status(401).json({ error: "token missing" });
//   }
// };

// const getTokenFrom = (request) => {
//   const authorization = request.get("authorization");
//   if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
//     return authorization.substring(7);
//   }
//   return null;
// };

// get all blogs, refactored
blogsRouter.get("/", errorHandler, async (request, response) => {
  let where = {};
  if (request.query.search) {
    console.log("searching for:", request.query.search);
    where = {
      [Op.or]: [
        { title: { [Op.substring]: request.query.search } },
        { author: { [Op.substring]: request.query.search } },
      ],
      // [Op.iLike]: request.query.search,
      // [Op.substring]: request.query.search,
    };
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: { model: User, attributes: ["name"] },
    where,
    order: [["likes", "DESC"]],
  });
  response.json(blogs);
});
// blogsRouter.get("/", async (request, response) => {
//   const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
//   response.json(blogs);
// });

//get blog by id, refactored
blogsRouter.get("/:id", blogFinder, errorHandler, async (request, response) => {
  if (request.blog) {
    // console.log(request.blog.toJSON());
    response.json(request.blog);
  } else {
    response.status(404).end();
  }
});

//post blog, refactored
blogsRouter.post("/", tokenExtractor, tokenValidator, errorHandler, async (request, response) => {
  const user = await User.findByPk(request.decodedToken.id);
  const blog = await Blog.create({ ...request.body, userId: user.id, date: new Date() });
  response.json(blog);
});

// blogsRouter.post("/", async (request, response, next) => {
//   const body = request.body;
//   // const decodedToken = jwt.verify(request.token, process.env.SECRET);
//   if (!request.token || !request.user) {
//     return response.status(401).json({ error: "token missing or invalid" });
//   }
//   // const user = await User.findById(decodedToken.id);
//   const user = request.user;
//   // console.log("user in controller----------",user.id)
//   const blog = new Blog({
//     author: body.author,
//     title: body.title,
//     url: body.url,
//     likes: body.likes || 0,
//     user: user._id,
//     comments: body.comments || [],
//   });

//   const savedBlog = await blog.save();
//   user.blogs = user.blogs.concat(savedBlog._id);
//   await user.save();

//   response.json(savedBlog);
// });

//delete blog, refactored
blogsRouter.delete(
  "/:id",
  blogFinder,
  tokenExtractor,
  tokenValidator,
  errorHandler,
  async (request, response) => {
    const user = await User.findByPk(request.decodedToken.id);
    console.log("the user is : ", user);
    console.log("the blog is : ", request.blog);
    if (request.blog) {
      if (request.blog.userId !== user.id) {
        return response
          .status(401)
          .json({ error: "wrong user, you do not have right to delete this blog!" });
      }
      await request.blog.destroy();
      response.status(204).end();
    } else {
      response.status(404).json({ error: "blog not found" });
    }
    // const decodedToken = jwt.verify(request.token, process.env.SECRET);
    // console.log(request)
    // const blog = await Blog.findById(request.params.id);
    // const user = request.user;
    // console.log(user);
    // const userId = await user._id;

    // if (blog.user.toString() === userId.toString()) {
    //   await Blog.findByIdAndRemove(request.params.id);
    //   response.status(204).end();
    // } else {
    //   response.status(401).json({ error: "wrong user" });
    // }
    // if (!request.token || !decodedToken.id) {
    //   response.status(401).json({ error: "token missing or invalid" });
    // } else if (blog.user.toString() !== userid.toString()) {
    //   response.status(401).json({ error: "wrong user" });
    // }
  }
);

blogsRouter.put("/:id", blogFinder, errorHandler, async (request, response) => {
  if (request.blog) {
    const body = request.body;

    request.blog.author = body.author || request.blog.author;
    request.blog.title = body.title || request.blog.title;
    request.blog.url = body.url || request.blog.url;
    request.blog.likes = body.likes || request.blog.likes;
    request.blog.comments = body.comments || request.blog.comments;

    await request.blog.save();
    // console.log(request.blog.toJSON());
    response.json(request.blog);
  } else {
    response.status(404).end();
  }
  // const body = request.body;

  // const blog = {
  //   author: body.author,
  //   title: body.title,
  //   url: body.url,
  //   likes: body.likes,
  //   comments: body.comments,
  // };

  // const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
  //   new: true,
  // });
  // response.json(updatedBlog.toJSON());
});

module.exports = blogsRouter;
