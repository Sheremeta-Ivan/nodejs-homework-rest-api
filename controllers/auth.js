const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
require("dotenv").config();
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");

const { User } = require("../models/user.js");

const { SECRET_KEY, BASE_URL } = process.env;

const {
  HttpError,
  ctrlWrapper,
  adjustingAvatar,
  sendEmail,
} = require("../helpers");

const avatarDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, `User with ${email} already exists`);
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verifyToken = nanoid();
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a href="${BASE_URL}/api/users/verify/${verifyToken}" target="_blank">Click to verify email</a>`,
    text: `To verify email, click on the link: ${BASE_URL}/api/users/verify/${verifyToken}`,
  };

  await sendEmail(verifyEmail);
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verifyToken,
  });

  res.status(201).json({
    email: newUser.email,
    name: newUser.name,
  });
};

const verifyEmail = async (req, res) => {
  const { verifyToken } = req.params;
  const user = await User.findOne({ verifyToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, { verify: true, verifyToken: null });
  res.status(200).json({
    message: "Verification successful",
  });
};

const repeatEmailVerify = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a href="${BASE_URL}/api/users/verify/${user.verifyToken}" target="_blank">Click to verify email</a>`,
    text: `To verify email, click on the link: ${BASE_URL}/api/users/verify/${user.verifyToken}`,
  };
  await sendEmail(verifyEmail);
  res.status(200).json({
    message: "Verification email sent",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(401, "Email is not verified");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw HttpError(401, "Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.status(200).json({
    token,
    user: {
      email: user.email,
      name: user.name,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, name } = req.user;
  res.status(200).json({
    email,
    name,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(200).json({ message: "Logout successful" });
};

const patchSubscription = async (req, res) => {
  const { _id, email } = req.user;
  const { subscription } = req.body;
  await User.findByIdAndUpdate(_id, { subscription });

  res.status(200).json({
    email,
    subscription,
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  if (req.file === undefined)
    throw HttpError(404, "Image was not found, check form-data values");

  const { path: tempUpload, originalname } = req.file;

  const fileName = `${_id}_${originalname}`;

  const resultUpload = path.join(avatarDir, fileName);
  await adjustingAvatar(tempUpload);
  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join("avatars", fileName);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.status(200).json({
    avatarURL,
  });
};

module.exports = {
  register: ctrlWrapper(register),
  verifyEmail: ctrlWrapper(verifyEmail),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  patchSubscription: ctrlWrapper(patchSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
  repeatEmailVerify: ctrlWrapper(repeatEmailVerify),
};
