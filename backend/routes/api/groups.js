const express = require("express");
const { Group } = require("../../db/models");
const router = express.Router();
const { requireAuth } = require("../../utils/auth.js");

//get all groups
router.get("/", async (req, res) => {
  const groups = await Group.findAll({
    attributes: [
      "id",
      "organizerId",
      "name",
      "about",
      "type",
      "private",
      "city",
      "state",
      "createdAt",
      "updatedAt",
      "previewImage",
    ],
  });
  return res.json({
    Groups: groups,
  });
});

//get groups created by authenticated current user
router.get("/current", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const groups = await Group.findAll({
    where: { userId: userId },
  });

  return res.json({
    Groups: groups,
  });
});

module.exports = router;
