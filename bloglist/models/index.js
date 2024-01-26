const Blog = require("./blog");
const User = require("./user");

Blog.sync();

module.exports = { Blog, User };
