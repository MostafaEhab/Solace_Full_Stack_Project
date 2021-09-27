const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validateRegisteration = require("../validation/register");
const validateLogin = require("../validation/login");
const validateUser = require("../validation/user");

require("dotenv").config();
const keys = process.env.JWT_SECRET;

const register = async (req, res) => {
  const { errors, isValid } = validateRegisteration(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res
        .status(400)
        .json({ email: "A user is already registed with this email" });
    } else {
      const user = new User({
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        paypalEmail: req.body.paypalEmail,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) throw err;
          user.password = hash;
          user.save();
        });
      });

      const payload = {
        id: user.id,
        email: user.email,
      };

      jwt.sign(payload, keys, { expiresIn: 3600 }, (err, token) => {
        res.json({ token: "Bearer " + token, userId: user.id });
      });
    }
  });
};

const login = (req, res) => {
  const { errors, isValid } = validateLogin(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ email: "This user does not exist." });
    }
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = {
          id: user.id,
          email: user.email,
        };
        jwt.sign(payload, keys, { expiresIn: 3600 }, (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token,
            userId: user.id,
          });
        });
      } else {
        return res
          .status(400)
          .json({ password: "Incorrect password, Please try again" });
      }
    });
  });
};

const read = async (req, res) => {
  let user;
  try {
    user = await User.findById(req.user.id).exec();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }

  if (!user)
    return res.status(404).json({
      error: "Not Found",
      message: `User not found`,
    });

  return res.status(200).json(stripPasswordAndIdImg(user));
};

const readById = async (req, res) => {
  let user;
  try {
    user = await User.findById(req.params.id).exec();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }

  if (!user)
    return res.status(404).json({
      error: "Not Found",
      message: `User not found`,
    });

  return res.status(200).json(stripPasswordAndIdImg(user));
};

// We will only allow an update of one field at a time.
const update = async (req, res) => {
  let check = validateUser.validateUpdateRequest(req);
  if (check) {
    return res.status(400).json(check);
  }

  let user;
  try {
    user = await User.findById(req.user.id).exec();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }

  if (!user)
    return res.status(404).json({
      error: "Not Found",
      message: `User not found`,
    });

  let key = Object.keys(req.body)[0];
  let value = req.body[key];

  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    }).exec();

    return res.status(200).json(stripPasswordAndIdImg(user));
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    await User.findByIdAndRemove(req.user.id).exec();
    return res
      .status(200)
      .json({ message: `User with id:${req.user.id} was deleted` });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
};
const getUser = async (req, res) => {
  let user;
  try {
    user = await User.findById(req.params.id).exec();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }

  if (!user)
    return res.status(404).json({
      error: "Not Found",
      message: `User not found`,
    });

  return res.status(200).json(stripPasswordAndIdImg(user));
};

function stripPasswordAndIdImg(user) {
  let safeUser = JSON.parse(JSON.stringify(user));
  delete safeUser.password;
  delete safeUser.identificationImg;
  return safeUser;
}

module.exports = {
  register,
  login,
  read,
  readById,
  update,
  remove,
  getUser,
};
