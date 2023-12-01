const express = require("express");
const { Event } = require("../../db/models");
const Sequelize = require("sequelize");
const router = express.Router();
const { requireAuth } = require("../../utils/auth.js");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation.js");

//get all events
router.get("/", async (req, res) => {
  const events = await Event.findAll({
    attributes: {
      exclude: ["price", "capacity"],
    },
  });
  events.venueId = null;
  return res.json({
    Events: events,
  });
});

module.exports = router;
