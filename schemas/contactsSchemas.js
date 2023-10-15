const Joi = require("joi");

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const updateSchema = Joi.object().length(1);

module.exports = {
  addSchema,
  updateSchema,
};
