import serviceSchema from '../../../global/sanitize/serviceSchema.js';
const validateData = (req, res, next) => {
  const { error } = serviceSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const messages = error.details.map(err => err.message);
    return res.status(400).json({ msg: 'Validation failed', errors: messages });
  }

  next();
};

export default validateData;