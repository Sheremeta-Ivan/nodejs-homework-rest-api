const Joi = require("joi");
const { emailRegexp } = require("../models/user");

const registerValidation = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `Missing required name field`,
  }),

  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": `Missing required email field`,
  }),

  password: Joi.string().min(6).required().messages({
    "any.required": `Missing required phone field`,
  }),

  subscription: Joi.string().default("starter"),

  token: Joi.string().default(null),
});

const loginValidation = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": `Missing required email field`,
  }),

  password: Joi.string().min(6).required().messages({
    "any.required": `Missing required phone field`,
  }),

  subscription: Joi.string().default("starter"),

  token: Joi.string().default(null),
});

const schemas = {
  registerValidation,
  loginValidation,
};

module.exports = { schemas };
