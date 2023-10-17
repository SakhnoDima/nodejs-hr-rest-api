const { HttpError } = require("../helpers");

const patch = "PATCH";
const post = "POST";

const validateBody = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      if (req.method === patch || post) {
        const { label } = error.details[0].context;
        next(HttpError(400, `Missing field ${label}`));
        return;
      }
      next(HttpError(400, "Missing required name field"));
    }
    next();
  };
  return func;
};

module.exports = validateBody;
