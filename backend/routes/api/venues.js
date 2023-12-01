const express = require("express");
const { Venue, Group } = require("../../db/models");
const Sequelize = require("sequelize");
const router = express.Router();
const { requireAuth } = require("../../utils/auth.js");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation.js");

module.exports = router;
