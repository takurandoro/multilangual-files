const { celebrate, Segments } = require('celebrate');
const Joi = require('joi');

const userSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  password2: Joi.any()
    .valid(Joi.ref('password'))
    .required()
    .messages({ 'any.only': 'must match password' }),
});

const validateRegistration = celebrate({ [Segments.BODY]: userSchema });

module.exports = { validateRegistration };
