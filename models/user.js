const { Schema, model } = require("mongoose");

const { handleMongooseError } = require("../helpers");

const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      minLength: 2,
      required: [true, "Set name for user"],
      default: "Guest",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [emailRegexp, "Please fill a valid email address"],
      unique: true,
    },
    password: {
      type: String,
      minLength: 6,
      required: [true, "Set password for user"],
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const User = model("user", userSchema);

module.exports = { User, emailRegexp };
