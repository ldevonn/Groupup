const express = require("express");
const { Group, Member, User, GroupImage } = require("../../db/models");
const { Sequelize, Op } = require("sequelize");
const router = express.Router();
const { requireAuth } = require("../../utils/auth.js");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation.js");

//delete image for group
router.delete("/:imageId", requireAuth, async (req, res) => {
  const imageId = req.params.imageId;
  const image = await GroupImage.findByPk(imageId);
  if (!image) {
    return res.status(404).json({ message: "Group Image couldn't be found" });
  }

  const userMember = await Member.findOne({
    where: { userId: req.user.id },
  });
  const groupId = userMember.groupId;

  const group = await Group.findByPk(groupId);
  if (userMember.status == "co-host" || group.organizerId === req.user.id) {
    await image.destroy();
    res.json({ message: "Successfully deleted" });
  } else {
    return res.status(403).json({ message: "Forbidden" });
  }
});

module.exports = router;
