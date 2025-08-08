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
    }),
  perfilPhoto: Joi.string()
    .uri()
    .required()
    .messages({
      'string.uri': 'Perfil photo must be a valid URL.'
    }),
  rating: Joi.number()
    .min(0)
    .max(5)
    .optional()
    .default(0)
    .messages({
      'number.base': 'Rating must be a number.',
      'number.min': 'Rating must be at least 0.',
      'number.max': 'Rating must not exceed 5.'
    }),
  numberOfRatings: Joi.number()
    .integer()
    .min(0)
    .optional()
    .default(0)
    .messages({
      'number.base': 'Number of ratings must be a number.',
      'number.integer': 'Number of ratings must be an integer.',
      'number.min': 'Number of ratings must be at least 0.'
    }),
  isEnabled: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'IsEnabled must be a boolean.'
    }),
});

export default userSchema;
