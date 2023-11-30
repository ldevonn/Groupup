const express = require("express");
const { Group } = require("../../db/models");
const Sequelize = require("sequelize");
const router = express.Router();
const { requireAuth } = require("../../utils/auth.js");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation.js");

const validateNewGroup = [
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ max: 60 })
    .withMessage("Name must be 60 characters or less."),
  check("about")
    .exists({ checkFalsy: true })
    .isLength({ min: 50 })
    .withMessage("About must be 50 characters or more"),
  check("type")
    .exists({ checkFalsy: true })
    .isIn(["Online", "In person"])
    .withMessage("Type must be 'Online' or 'In person'"),
  check("private")
    .exists({ checkFalsy: true })
    .isBoolean(true)
    .withMessage("Private must be a boolean"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  handleValidationErrors,
];

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

//create a group
router.post("/", validateNewGroup, requireAuth, async (req, res) => {
  const { name, about, type, private, city, state } = req.body;

  const organizerId = req.user.id;

  const newGroup = await Group.create({
    organizerId,
    name,
    about,
    type,
    private,
    city,
    state,
  });

  const response = {
    id: newGroup.id,
    organizerId: newGroup.organizerId,
    name: newGroup.name,
    about: newGroup.about,
    type: newGroup.type,
    private: newGroup.private,
    city: newGroup.city,
    state: newGroup.state,
    createdAt: newGroup.createdAt,
    updatedAt: newGroup.updatedAt,
  };

  return res.status(201).json(response);
});

//edit a group
router.put("/:groupId", validateNewGroup, requireAuth, async (req, res) => {
  const groupId = req.params.groupId;
  const { name, about, type, private, city, state } = req.body;

  const group = await Group.findByPk(groupId);

  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  if (req.user.id !== group.organizerId) {
    return res
      .status(403)
      .json({ error: "You are not the organizer of this group" });
  }

  group.name = name;
  group.about = about;
  group.type = type;
  group.private = private;
  group.city = city;
  group.state = state;

  await group.save();

  const response = {
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
  };

  return res.json(response);
});

module.exports = router;
