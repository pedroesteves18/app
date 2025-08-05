import Joi from 'joi';

const userSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email must be a valid email address.',
      'any.required': 'Email is required.'
    }),

  username: Joi.string()
    .min(3)
    .required()
    .messages({
      'string.base': 'Username must be a string.',
      'string.min': 'Username must be at least 3 characters long.',
      'any.required': 'Username is required.'
    }),

  password: Joi.string()
    .min(6)
    .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])'))
    .required()
    .messages({
      'string.base': 'Password must be a string.',
      'string.min': 'Password must be at least 6 characters long.',
      'string.pattern.base': 'Password must contain letters and numbers.',
      'any.required': 'Password is required.'
    }),

  role: Joi.string()
    .valid('Admin', 'Contractor', 'Provider')
    .required()
    .messages({
      'any.only': 'Role must be one of: admin, user, guest.',
      'any.required': 'Role is required.'
    })
});

export default userSchema;
