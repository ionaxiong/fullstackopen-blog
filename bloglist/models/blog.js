// const mongoose = require("mongoose");
// var uniqueValidator = require("mongoose-unique-validator");

// const blogSchema = new mongoose.Schema({
//   author: {type: String, required: true},
//   title: {type: String, required: true, unique: true},
//   url: {type: String, required: true, unique: true},
//   likes: {type: Number, required: true},
//   comments: {type: [String], required: false},
//   //expand to contain info about the user who created it
//   user:{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User"
//   }
// });

// blogSchema.plugin(uniqueValidator);

// blogSchema.set("toJSON", {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString();
//     delete returnedObject._id;
//     delete returnedObject.__v;
//   },
// });

// module.exports = mongoose.model("Blog", blogSchema);

const { Model, DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comments: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "Blog",
  }
);

Blog.sync();

module.exports = Blog;
