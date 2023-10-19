const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;

const tokenCreator = async (payload) => {
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  return token;
};

const isValidToken = async (token) => {
  const { id } = jwt.verify(token, SECRET_KEY);
  return id;
};

module.exports = { tokenCreator, isValidToken };
