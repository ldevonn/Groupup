const express = require("express");
const { Event, Group, Venue, EventImage } = require("../../db/models");
const Sequelize = require("sequelize");
const router = express.Router();
const { requireAuth } = require("../../utils/auth.js");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation.js");

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

//get all events
router.get("/", async (req, res) => {
  const events = await Event.findAll({
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
      numAttending: "REPLACE THIS",
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

//get event by id
router.get("/:eventId", async (req, res) => {
  const event = await Event.findByPk(req.params.eventId, {
    include: [
      {
        model: Group,
        attributes: ["id", "name", "private", "city", "state"],
      },
      {
        model: Venue,
        attributes: ["id", "address", "city", "state", "lat", "lng"],
      },
      {
        model: EventImage,
        attributes: ["id", "url", "preview"],
      },
    ],
  });
  if (!event) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }

  return res.json({
    id: event.id,
    groupId: event.groupId,
    venueId: event.venueId,
    name: event.name,
    description: event.description,
    type: event.type,
    capacity: event.capacity,
    //
    price: event.price,
    startDate: event.startDate,
    endDate: event.endDate,
    numAttending: "REPLACE THIS",
    name: event.name,
    description: event.description,
    type: event.type,
    capacity: event.capacity,
    Group: event.Group,
    Venue: event.Venue,
    EventImages: event.EventImages,
  });
});

//add image to event
router.post("/:eventId/images", requireAuth, async (req, res) => {
  const { url, preview } = req.body;
  const eventId = req.params.eventId;
  const event = await Event.findByPk(eventId);
  if (!event)
    return res.status(404).json({ message: "Event couldn't be found" });

  const newImage = await EventImage.create({
    eventId,
    url,
    preview,
  });

  const response = {
    id: newImage.id,
    url: newImage.url,
    preview: newImage.preview,
  };

  return res.json(response);
});

//edit an event
router.put("/:eventId", validateNewEvent, requireAuth, async (req, res) => {
  const eventId = req.params.eventId;
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

  const venue = await Venue.findByPk(venueId);
  if (!venue) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  const group = await Group.findByPk(venue.groupId);

  const event = await Event.findByPk(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }

  if (req.user.id !== group.organizerId) {
    return res
      .status(403)
      .json({ error: "You are not the organizer of this group" });
  }

  event.venueId = venueId;
  event.name = name;
  event.type = type;
  event.capacity = capacity;
  event.price = price;
  event.description = description;
  event.startDate = startDate;
  event.endDate = endDate;

  await event.save();

  const response = {
    id: event.id,
    groupId: event.groupId,
    name: event.name,
    type: event.type,
    capacity: event.capacity,
    price: event.price,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
  };

  return res.json(response);
});
module.exports = router;
