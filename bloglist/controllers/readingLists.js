const readingListRouter = require("express").Router();
const { User, Blog, ReadingLists } = require("../models");

readingListRouter.post("/", async (request, response) => {
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

module.exports = readingListRouter;
