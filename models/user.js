const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");
const subscriptions = require("../constans/subscriptions");
const emailRegex = /[a-z0-9]+@[a-z]+.[a-z]{2,3}/;

const userSchema = new Schema(
  {
    password: {
      type: String,
      minlength: 6,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      match: emailRegex,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: [...Object.values(subscriptions)],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false }
);
const subscriptSchema = Joi.object().keys({
  subscription: Joi.string().valid(...Object.values(subscriptions)),
});
const userJoiSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().pattern(emailRegex).required(),
});

userSchema.post("save", handleMongooseError);

const User = model("user", userSchema);
const schemas = { userJoiSchema, subscriptSchema };

module.exports = { User, schemas };
