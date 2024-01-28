const Blog = require("./blog");
const User = require("./user");
const Team = require("./team");
const Membership = require("./membership");
const UserBlogs = require("./userBlogs");
const ReadingList = require("./readinglist");

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Team, { through: Membership });
Team.belongsToMany(User, { through: Membership });

User.belongsToMany(Blog, { through: UserBlogs, as: "marked_blogs" });
Blog.belongsToMany(User, { through: UserBlogs, as: "users_marked" });

Blog.belongsToMany(User, { through: ReadingList, as: "readings" });
User.belongsToMany(Blog, { through: ReadingList, as: "readers"} );

// Blog.sync({ alter: true });
// User.sync({ alter: true });

module.exports = { Blog, User, Team, Membership, UserBlogs, ReadingList };
