const readingListsRouter = require("express").Router();
const { User, Blog, ReadingLists } = require("../models");
const { errorHandler, tokenExtractor , tokenValidator} = require("../utils/middleware");

readingListsRouter.post("/", errorHandler, async (request, response) => {
  const { body } = request;

  if (!body.userId || !body.blogId) {
    return response.status(400).json({
      error: "userId or blogId is missing",
    });
  }

  const { userId, blogId } = body;

  const foundUser = await User.findByPk(userId);
  const foundBlog = await Blog.findByPk(blogId);

  if (!foundUser || !foundBlog) {
    return response.status(400).json({
      error: "userId or blogId is invalid",
    });
  }

  const readingList = new ReadingLists({
    userId: userId,
    blogId: blogId,
  });

  console.log("readingList is : ", readingList);

  await readingList.save();
  response.status(201).json(readingList);
});

readingListsRouter.put("/:id", tokenExtractor, tokenValidator, async (request, response) => {
  const readingList = await ReadingLists.findByPk(request.params.id);
  const user = await User.findByPk(request.decodedToken.id);
  if (user.id !== readingList.userId) {
    return response.status(401).json({
      error: "You cannot update this readingList",
    });
  }
  const { read } = request.body;
  readingList.read = read;
  await readingList.save();
  response.json(readingList);
});

module.exports = readingListsRouter;
