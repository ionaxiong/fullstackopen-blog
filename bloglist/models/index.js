const Blog = require("./blog");
const User = require("./user");
const Team = require("./team");
const Membership = require("./membership");
const UserBlogs = require("./userBlogs");
const ReadingLists = require("./readingLists");

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Team, { through: Membership });
Team.belongsToMany(User, { through: Membership });

User.belongsToMany(Blog, { through: UserBlogs, as: "marked_blogs" });
Blog.belongsToMany(User, { through: UserBlogs, as: "users_marked" });

Blog.belongsToMany(User, { through: ReadingLists, as: "readers" });
User.belongsToMany(Blog, { through: ReadingLists, as: "readings" });

// Blog.sync({ alter: true });
// User.sync({ alter: true });

module.exports = { Blog, User, Team, Membership, UserBlogs, ReadingLists };
