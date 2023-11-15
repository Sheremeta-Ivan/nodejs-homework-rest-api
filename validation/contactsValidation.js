const Joi = require("joi");

const contactsValidation = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `Missing required name field`,
  }),

  email: Joi.string().required().messages({
    "any.required": `Missing required email field`,
  }),

  phone: Joi.string().required().messages({
    "any.required": `Missing required phone field`,
  }),
});

const updateFavorites = Joi.object({
  favorite: Joi.boolean().required().messages({
    "any.required": `Missing field favorite`,
  }),
});

module.exports = {
  contactsValidation,
  updateFavorites,
};
