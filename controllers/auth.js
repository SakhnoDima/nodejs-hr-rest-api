const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const Jimp = require("jimp");

const { User } = require("../models/user");
const { HttpError, controllerWrapper } = require("../helpers/index");
const { tokenCreator } = require("../helpers");
const path = require("path");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

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
  const result = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
    projection: "-_id -password -token",
  });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.status(201).json(result);
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const avatarsDir = path.join(__dirname, "../", "public", "avatars");

  const { path: tempUpload, originalname } = req.file;
  const uniqName = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, uniqName);

  Jimp.read(tempUpload, (err, avatar) => {
    if (err) throw err;
    avatar.resize(250, 250).write(resultUpload);
  });

  const avatarURL = path.join("avatars", uniqName);

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.status(200).json({
    avatarURL: avatarURL,
  });
};

module.exports = {
  register: controllerWrapper(register),
  login: controllerWrapper(login),
  getCurrentUser: controllerWrapper(getCurrentUser),
  logout: controllerWrapper(logout),
  subscriptionRefresh: controllerWrapper(subscriptionRefresh),
  updateAvatar: controllerWrapper(updateAvatar),
};
