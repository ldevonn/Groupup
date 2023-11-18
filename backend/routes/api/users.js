const express = require("express");
const bcrypt = require("bcryptjs");
const { setTokenCookie, requireAuth } = require("../../utils/auth.js");
const { User } = require("../../db/models");
const router = express.Router();
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation.js");

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  handleValidationErrors,
];

//signup
router.post("/", validateSignup, async (req, res) => {
  //saves email, password, and username values from request body
  const { email, password, username } = req.body;
  //hashes the password
  const hashedPassword = bcrypt.hashSync(password);
  //creates a user with the email, username, and hashedPassword
  const user = await User.create({ email, username, hashedPassword });

  //user object
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
  };
  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser,
  });
});

module.exports = router;
