const express = require("express");
const { Group } = require("../../db/models");
const Sequelize = require("sequelize");
const router = express.Router();
const { requireAuth } = require("../../utils/auth.js");

//get all groups
router.get("/", async (req, res) => {
  const groups = await Group.scope("withMemberCount").findAll();
  return res.json({
    Groups: groups.map((group) => ({
      id: group.id,
      organizerId: group.organizerId,
      name: group.name,
      about: group.about,
      type: group.type,
      private: group.private,
      city: group.city,
      state: group.state,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
      numMembers: group.getDataValue("numMembers"),
      previewImage: group.previewImage,
    })),
  });
});

//get groups created by authenticated current user
router.get("/current", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const groups = await Group.scope("withMemberCount").findAll({
    where: { organizerId: userId },
  });

  return res.json({
    Groups: groups.map((group) => ({
      id: group.id,
      organizerId: group.organizerId,
      name: group.name,
      about: group.about,
      type: group.type,
      private: group.private,
      city: group.city,
      state: group.state,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
      numMembers: group.getDataValue("numMembers"),
      previewImage: group.previewImage,
    })),
  });
});

//get details of a group from it's id
router.get("/:groupId", async (req, res) => {
  const groupId = req.params.groupId;
  const group = await Group.scope("withMemberCount").findOne({
    where: { id: groupId },
  });
  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }
  return res.json({
    Groups: {
      id: group.id,
      organizerId: group.organizerId,
      name: group.name,
      about: group.about,
      type: group.type,
      private: group.private,
      city: group.city,
      state: group.state,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
      numMembers: group.getDataValue("numMembers"),
    },
  });
});

//delete a group
router.delete("/:groupId", requireAuth, async (req, res) => {
  const groupId = req.params.groupId;

  const group = await Group.findOne({
    where: { id: groupId },
  });

  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  await group.destroy();
  return res.json({ message: "Successfully deleted" });
});

module.exports = router;
