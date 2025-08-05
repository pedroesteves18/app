import userSchema from '../../../global/sanitize/userSchema.js';
const validateData = (req, res, next) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const messages = error.details.map(err => err.message);
    return res.status(400).json({ msg: 'Validation failed', errors: messages });
  }

  next();
};

export default validateData;