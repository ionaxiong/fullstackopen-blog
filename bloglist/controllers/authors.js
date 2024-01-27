const authorRouter = require("express").Router();
const { errorHandler } = require("../utils/middleware");
const { Blog } = require("../models");
const { fn, col } = require("sequelize");

//returns the number of blogs for each author and the total number of likes.
// Implement the operation directly at the database level.
//You will most likely need the group by functionality, and the sequelize.fn aggregator function.
// output fields are {author, articleCounts, likes}
authorRouter.get("/", errorHandler, async (request, response) => {
  const authors = await Blog.findAll({
    attributes: [
      "author",
      [fn("count", col("title")), "articles"],
      [fn("sum", col("likes")), "likes"],
    ],
    group: ["author"],
  });
  response.json(authors);
});

module.exports = authorRouter;
