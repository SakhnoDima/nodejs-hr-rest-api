const bcrypt = require("bcrypt");

const { User } = require("../models/user");
const { HttpError, controllerWrapper } = require("../helpers/index");
const { tokenCreator } = require("../helpers");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const token = await tokenCreator({ id: user._id });

  const result = await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token: token,
    user: {
      email: result.email,
      subscription: result.subscription,
    },
  });
};

const getCurrentUser = async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({
    email: email,
    subscription: subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: " " });

  res.status(204).json({});
};

const subscriptionRefresh = async (req, res) => {
  const { _id } = req.user;
  console.log(req.body);
  const result = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
    projection: "-_id -password -token",
  });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.status(201).json(result);
};

module.exports = {
  register: controllerWrapper(register),
  login: controllerWrapper(login),
  getCurrentUser: controllerWrapper(getCurrentUser),
  logout: controllerWrapper(logout),
  subscriptionRefresh: controllerWrapper(subscriptionRefresh),
};
