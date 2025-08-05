import validator from 'validator';

function deepSanitize(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;

  const sanitized = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    const value = obj[key];

    if (typeof value === 'string') {
      sanitized[key] = validator.escape(value.trim());
    } else if (typeof value === 'object') {
      sanitized[key] = deepSanitize(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

const sanitize = async (req, res, next) => {
  try {
    req.body = deepSanitize(req.body);

    // Atualiza os campos de req.query e req.params individualmente
    for (const key in req.query) {
      req.query[key] = deepSanitize(req.query[key]);
    }
    for (const key in req.params) {
      req.params[key] = deepSanitize(req.params[key]);
    }

    next();
  } catch (error) {
    res.status(500).send({ message: 'Error on data sanitizing', error: error.message });
  }
};

export default sanitize;