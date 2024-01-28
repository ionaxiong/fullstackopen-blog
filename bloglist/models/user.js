// const mongoose = require("mongoose");
// var uniqueValidator = require("mongoose-unique-validator");

// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     unique: true,
//     required: true,
//   },
//   name: String,
//   passwordHash: {
//     type: String,
//     required: true,
//   },
//   blogs: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Blog",
//     },
//   ],
// });

// userSchema.plugin(uniqueValidator);

// userSchema.set("toJSON", {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString();
//     delete returnedObject._id;
//     delete returnedObject.__v;
//     delete returnedObject.passwordHash;
//   },
// });

// const User = mongoose.model("User", userSchema);

// module.exports = User;

const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        // isEmail: {
        //   args: true,
        //   msg: "Validation isEmail on username failed",
        // },
        len: {
          args: [3, 50],
          msg: "Please enter a username between 3 and 50 characters",
        },
      },
    },
    name: {
      type: DataTypes.STRING,
    },
    passwordHash: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "user",
  }
);

module.exports = User;
