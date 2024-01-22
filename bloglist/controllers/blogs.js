const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

// const getTokenFrom = (request) => {
//   const authorization = request.get("authorization");
//   if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
//     return authorization.substring(7);
//   }
//   return null;
// };

// get all blogs, refactored
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

//get blog by id, refactored

// eslint-disable-next-line no-unused-vars
blogsRouter.get("/:id", async (request, response, next) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

//post blog, refactored
// eslint-disable-next-line no-unused-vars
blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;
  // const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!request.token || !request.user) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  // const user = await User.findById(decodedToken.id);
  const user = request.user;
  // console.log("user in controller----------",user.id)
  const blog = new Blog({
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
    comments: body.comments || [],
  });
  
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  
  response.json(savedBlog);
});

//delete blog, refactored
// eslint-disable-next-line no-unused-vars
blogsRouter.delete("/:id", async (request, response, next) => {
  // const decodedToken = jwt.verify(request.token, process.env.SECRET);
  // console.log(request)
  console.log(request.params.id);
  const blog = await Blog.findById(request.params.id);
  const user = request.user;
  console.log(user);
  const userId = await user._id;

  if (blog.user.toString() === userId.toString()) {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } else {
    response.status(401).json({ error: "wrong user" });
  }
  // if (!request.token || !decodedToken.id) {
  //   response.status(401).json({ error: "token missing or invalid" });
  // } else if (blog.user.toString() !== userid.toString()) {
  //   response.status(401).json({ error: "wrong user" });
  // }
});

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const blog = {
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes,
    comments: body.comments,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.json(updatedBlog.toJSON());
});

module.exports = blogsRouter;
