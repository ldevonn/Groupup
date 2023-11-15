const express = require("express");
const bcrypt = require("bcryptjs");
const { setTokenCookie, requireAuth } = require("../../utils/auth.js");
const { User } = require("../../db/models");
const router = express.Router();

//signup
router.post("/", async (req, res) => {
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
