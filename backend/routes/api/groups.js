const express = require("express");
const {
  User,
  Group,
  GroupImage,
  Venue,
  Event,
  EventImage,
  Member,
} = require("../../db/models");
const { Op, Sequelize } = require("sequelize");
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
  check("private").isBoolean().withMessage("Private must be a boolean"),
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

const validateNewEvent = [
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters"),

  check("type")
    .exists({ checkFalsy: true })
    .isIn(["Online", "In person"])
    .withMessage("Type must be 'Online' or 'In person'"),

  check("capacity")
    .exists({ checkFalsy: true })
    .isInt({ min: 0 })
    .withMessage("Capacity must be an integer"),

  check("price")
    .exists({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage("Price is invalid"),

  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),

  check("startDate")
    .custom((value, { req }) => {
      const startDate = new Date(value);
      const currentDate = new Date();
      return startDate > currentDate;
    })
    .withMessage("Start date must be in the future"),

  check("endDate")
    .custom((value, { req }) => {
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(value);
      return endDate > startDate;
    })
    .withMessage("End date is less than start date"),
  handleValidationErrors,
];
async function getMembers(groupId) {
  numMembers = await Member.count({
    where: {
      groupId: groupId,
    },
  });
  return numMembers;
}
//get all groups
router.get("/", async (req, res) => {
  const groups = await Group.findAll({
    include: [
      {
        model: GroupImage,
        where: {
          preview: { [Sequelize.Op.eq]: true },
        },
        required: false,
      },
    ],
  });

  const formattedResult = await Promise.all(
    groups.map(async (group) => {
      const previewImages = group.GroupImages.filter((image) => image.preview);
      let previewImage = null;

      if (previewImages.length > 0) {
        previewImage = previewImages[0].url;
      }
      let numMembers = await getMembers(group.id);

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
        numMembers,
        previewImage,
      };
    })
  );

  return res.json({ Groups: formattedResult });
});

//get groups created by authenticated current user
router.get("/current", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const groups = await Group.findAll({
    where: { organizerId: userId },
    include: [
      {
        model: GroupImage,
        where: {
          preview: { [Sequelize.Op.eq]: true },
        },
        required: false,
      },
    ],
  });

  const formattedResult = await Promise.all(
    groups.map(async (group) => {
      const previewImages = group.GroupImages.filter((image) => image.preview);
      let previewImage = null;

      if (previewImages.length > 0) {
        previewImage = previewImages[0].url;
      }
      let numMembers = await getMembers(group.id);

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
        numMembers,
        previewImage,
      };
    })
  );

  return res.json({ Groups: formattedResult });
});

//get details of a group from it's id
router.get("/:groupId", async (req, res) => {
  const groupId = req.params.groupId;
  const group = await Group.findOne({
    where: { id: groupId },
    include: [
      {
        model: GroupImage,
        attributes: ["id", "url", "preview"],
      },
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Venue,
        attributes: ["id", "groupId", "address", "city", "state", "lat", "lng"],
      },
    ],
  });
  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  const numMembers = await getMembers(group.id);

  return res.json({
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
    numMembers,
    groupImages: group.GroupImages,
    Organizer: group.User,
    Venues: group.Venues,
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
router.post("/", requireAuth, validateNewGroup, async (req, res) => {
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
router.put("/:groupId", requireAuth, validateNewGroup, async (req, res) => {
  const groupId = req.params.groupId;
  const { name, about, type, private, city, state } = req.body;

  const group = await Group.findByPk(groupId);

  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  if (req.user.id !== group.organizerId) {
    return res.status(403).json({ error: "Forbidden" });
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
  requireAuth,
  validateNewVenue,
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

    return res.status(200).json(response);
  }
);

//get all events of a group specified by its id
router.get("/:groupId/events", async (req, res) => {
  const groupId = req.params.groupId;

  const group = await Group.findByPk(groupId);
  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  const events = await Event.findAll({
    where: { groupId: groupId },
    attributes: {
      exclude: ["price", "capacity", "description"],
    },
    include: [
      {
        model: Group,
        attributes: ["id", "name", "city", "state"],
      },
      {
        model: Venue,
        attributes: ["id", "city", "state"],
      },
      {
        model: EventImage,
        attributes: ["url"],
        where: { preview: true },
        required: false,
      },
    ],
  });

  const formattedEvents = events.map((event) => {
    const previewImage = event.EventImages.length
      ? event.EventImages[0].url
      : null;
    const formattedEvent = {
      id: event.id,
      groupId: event.groupId,
      venueId: event.venueId,
      name: event.name,
      type: event.type,
      startDate: event.startDate,
      endDate: event.endDate,
      numAttending: event.numAttending,
      previewImage: previewImage,
      Group: {
        id: event.Group.id,
        name: event.Group.name,
        city: event.Group.city,
        state: event.Group.state,
      },
      Venue: event.Venue
        ? {
            id: event.Venue.id,
            city: event.Venue.city,
            state: event.Venue.state,
          }
        : null,
    };
    return formattedEvent;
  });

  return res.json({
    Events: formattedEvents,
  });
});

//create an event for a group
router.post(
  "/:groupId/events",
  requireAuth,
  validateNewEvent,
  async (req, res) => {
    //groupId
    const groupId = req.params.groupId;
    //organizerId
    const organizerId = req.user.id;
    //body params
    const {
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    } = req.body;

    //find and check group
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group couldn't be found" });
    }
    if (group.organizerId !== organizerId) {
      return res.status(403).json({ message: "Permission denied" });
    }

    //find and check venue
    const venue = await Venue.findByPk(venueId);
    if (!venue) {
      return res.status(404).json({ message: "Venue couldn't be found" });
    }

    const newEvent = await Event.create({
      venueId,
      groupId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    });

    const response = {
      venueId: newEvent.id,
      name: newEvent.name,
      type: newEvent.type,
      capacity: newEvent.capacity,
      price: newEvent.price,
      description: newEvent.description,
      startDate: newEvent.startDate,
      endDate: newEvent.endDate,
    };

    return res.json(response);
  }
);

module.exports = router;
