const handleMongooseError = (error, date, next) => {
  const { name, code } = error;

  const status = name === "MongoServerError" && code ? 409 : 401;

  error.status = status;

  next();
};

module.exports = handleMongooseError;
