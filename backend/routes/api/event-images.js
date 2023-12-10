const express = require("express");
const router = express.Router();
const { Event } = require("../../db/models");
const { requireAuth } = require("../../utils/auth.js");
const { noImage, userValidate } = require("../../utils/checks.js");

//delete image for event
router.delete("/:imageId", requireAuth, async (req, res) => {
  if ((await noImage("event", req.params.imageId)) === true) {
    return res.status(404).json({ message: "Event Image couldn't be found" });
  }
  let image = await noImage("event", req.params.imageId);

  const event = await Event.findByPk(image.eventId);

  if (await userValidate(req.user.id, event.groupId)) {
    await image.destroy();
    res.json({ message: "Successfully deleted" });
  } else {
    return res.status(403).json({ message: "Forbidden" });
  }
});

module.exports = router;
