const Joi = require("joi");

const updateFavorites = Joi.object({
  favorite: Joi.boolean().required().messages({
    "any.required": `Missing field favorite`,
  }),
});

module.exports = updateFavorites;
