const express = require("express");
const { Group, GroupImage, Venue } = require("../../db/models");
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

const validateNewVenue = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be within -90 and 90"),
  check("lng")
    .exists({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),
  handleValidationErrors,
];

//get all groups
router.get("/", async (req, res) => {
  const groups = await Group.scope("withMemberCount").findAll({
    include: [
      {
        model: GroupImage,
        where: {
          groupId: Group.sequelize.col("Group.id"),
          preview: true,
        },
        required: false,
      },
    ],
  });

  const formattedGroups = groups.map((group) => {
    const previewImages = group.GroupImages.filter((image) => image.preview);
    let previewImage = null;

    if (previewImages.length > 0) {
      previewImage = previewImages[0].url;
    }

    return {
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
      previewImage,
    };
  });
  return res.json({ Groups: formattedGroups });
});

//get groups created by authenticated current user
router.get("/current", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const groups = await Group.scope("withMemberCount").findAll({
    where: { organizerId: userId },
    include: [
      {
        model: GroupImage,
        where: {
          groupId: Group.sequelize.col("Group.id"),
          preview: true,
        },
        required: false,
      },
    ],
  });

  const formattedGroups = groups.map((group) => {
    const previewImages = group.GroupImages.filter((image) => image.preview);
    let previewImage = null;

    if (previewImages.length > 0) {
      previewImage = previewImages[0].url;
    }

    return {
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
      previewImage: previewImage,
    };
  });
  return res.json({ Groups: formattedGroups });
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

//add image to group based on groups id

router.post("/:groupId/images", requireAuth, async (req, res) => {
  const groupId = req.params.groupId;
  const { url, preview } = req.body;

  const group = await Group.findByPk(groupId);

  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  const newImage = await GroupImage.create({
    url,
    groupId,
    preview,
  });

  const response = {
    id: newImage.id,
    url: newImage.url,
    preview: newImage.preview,
  };

  return res.json(response);
});

//get all venues for group specified by its id

router.get("/:groupId/venues", requireAuth, async (req, res) => {
  const groupId = req.params.groupId;
  const group = await Group.findByPk(groupId);

  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  const venues = await Venue.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    where: {
      groupId: groupId,
    },
  });

  return res.json({ Venues: venues });
});

//create new venue for group specified by its id

router.post(
  "/:groupId/venues",
  validateNewVenue,
  requireAuth,
  async (req, res) => {
    const groupId = req.params.groupId;
    const organizerId = req.user.id;
    const { address, city, state, lat, lng } = req.body;

    const group = await Group.findByPk(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group couldn't be found" });
    }

    if (group.organizerId !== organizerId) {
      return res.status(403).json({ message: "Permission denied" });
    }

    const newVenue = await Venue.create({
      groupId: parseInt(groupId),
      address,
      city,
      state,
      lat,
      lng,
    });

    const response = {
      id: newVenue.id,
      groupId: newVenue.groupId,
      address: newVenue.address,
      city: newVenue.city,
      state: newVenue.state,
      lat: newVenue.lat,
      lng: newVenue.lng,
    };

    return res.status(201).json(response);
  }
);

module.exports = router;
