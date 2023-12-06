const express = require("express");
const bcrypt = require("bcryptjs");
const { setTokenCookie, requireAuth } = require("../../utils/auth.js");
const { User } = require("../../db/models");
const router = express.Router();
const { check } = require("express-validator");
const { validationResult } = require("express-validator");

const handleUserValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach((error) => (errors[error.path] = error.msg));

    const err = {
      message: "User already exists",
      errors: errors,
    };

    return res.status(500).json(err);
  }

  next();
};

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Invalid email.")
    .custom(async (value) => {
      const user = await User.findOne({ where: { email: value } });
      if (user) {
        throw new Error("User with that email already exists");
      }
      return true;
    }),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Username is required")
    .custom(async (value) => {
      const user = await User.findOne({ where: { username: value } });
      if (user) {
        throw new Error("User with that username already exists");
      }
      return true;
    }),
  check("firstName")
    .exists({ checkFalsy: true })
    .withMessage("First Name is required"),
  check("lastName")
    .exists({ checkFalsy: true })
    .withMessage("Last Name is required"),
  handleUserValidationErrors,
];

//signup
router.post("/", validateSignup, async (req, res) => {
  //saves email, password, and username values from request body
  const { firstName, lastName, username, email, password } = req.body;
  //hashes the password
  const hashedPassword = bcrypt.hashSync(password);
  //creates a user with the email, username, and hashedPassword
  const user = await User.create({
    firstName,
    lastName,
    email,
    username,
    hashedPassword,
  });

  //user object
  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
  };
  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser,
  });
});

module.exports = router;
