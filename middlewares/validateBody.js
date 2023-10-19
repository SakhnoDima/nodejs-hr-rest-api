const subscriptions = require("../constans/subscriptions");
const { HttpError } = require("../helpers");

const patch = "PATCH";
const post = "POST";

const validateBody = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const { label } = error.details[0].context;
      if (req.method === patch || post) {
        console.log(error.message);
        if (error.details[0].context.label === "subscription") {
          next(
            HttpError(
              400,
              `${label} must be one of: ${[...Object.values(subscriptions)]}`
            )
          );
          return;
        }
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
