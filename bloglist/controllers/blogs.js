const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

const blogFinder = async (request, response, next) => {
  const blog = await Blog.findByPk(request.params.id);
  if (blog) {
    request.blog = blog;
    next();
  } else {
    response.status(404).end();
  }
};

// const getTokenFrom = (request) => {
//   const authorization = request.get("authorization");
//   if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
//     return authorization.substring(7);
//   }
//   return null;
// };

// get all blogs, refactored
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.findAll();
  console.log(Blog.findAll());
  console.log("blogs are:", JSON.stringify(blogs, null, 2));
  response.json(blogs);
});
// blogsRouter.get("/", async (request, response) => {
//   const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
//   response.json(blogs);
// });

//get blog by id, refactored

// eslint-disable-next-line no-unused-vars
blogsRouter.get("/:id", blogFinder, async (request, response, next) => {
  if (request.blog) {
    console.log(request.blog.toJSON());
    response.json(request.blog);
  } else {
    response.status(404).end();
  }
});

//post blog, refactored
// eslint-disable-next-line no-unused-vars
blogsRouter.post("/", async (request, response, next) => {
  try {
    const blog = await Blog.create(request.body);
    response.json(blog);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
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
// eslint-disable-next-line no-unused-vars
blogsRouter.delete("/:id", blogFinder, async (request, response, next) => {
  if (request.blog) {
    try {
      await request.blog.destroy();
      response.status(204).end();
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  } else {
    response.status(404).end();
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
});

blogsRouter.put("/:id", blogFinder, async (request, response) => {
  if (request.blog) {
    const body = request.body;

    request.blog.author = body.author || request.blog.author;
    request.blog.title = body.title || request.blog.title;
    request.blog.url = body.url || request.blog.url;
    request.blog.likes = body.likes || request.blog.likes;
    request.blog.comments = body.comments || request.blog.comments;
    await request.blog.save();
    console.log(request.blog.toJSON());
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
