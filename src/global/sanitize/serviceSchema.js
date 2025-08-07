import Joi from 'joi';

const serviceSchema = Joi.object({
  isEnabled: Joi.boolean().default(true),

  name: Joi.string()
    .min(1)
    .optional()
    .messages({
      'string.base': 'Name must be a string.',
      'string.empty': 'Name cannot be empty.',
      'any.required': 'Name is required.'
    }),

  description: Joi.string()
    .min(1)
    .optional()
    .messages({
      'string.base': 'Description must be a string.',
      'string.empty': 'Description cannot be empty.',
      'any.required': 'Description is required.'
    }),

}).unknown(true); // Allow additional unknown fields

export default serviceSchema;