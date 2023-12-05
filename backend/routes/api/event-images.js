const express = require("express");
const { Group, Event, Member, User, EventImage } = require("../../db/models");
const { Sequelize, Op } = require("sequelize");
const router = express.Router();
const { requireAuth } = require("../../utils/auth.js");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation.js");

//delete image for group
router.delete("/:imageId", requireAuth, async (req, res) => {
  const imageId = req.params.imageId;
  const image = await EventImage.findByPk(imageId);
  if (!image) {
    return res.status(404).json({ message: "Event Image couldn't be found" });
  }

  const userMember = await Member.findOne({
    where: { userId: req.user.id },
  });

  const eventId = image.eventId;

  const event = await Event.findByPk(eventId);
  const group = await Group.findByPk(event.groupId);

  if (userMember.status == "co-host" || group.organizerId === req.user.id) {
    await image.destroy();
    res.json({ message: "Successfully deleted" });
  } else {
    return res.status(403).json({ message: "Forbidden" });
  }
});

module.exports = router;
