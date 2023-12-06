const express = require("express");
const { Event, Group, Venue, EventImage } = require("../../db/models");
const router = express.Router();
const { requireAuth } = require("../../utils/auth.js");
const {
  validateNewEvent,
  validateQueries,
  pagination,
} = require("../../utils/validation.js");

//get all events
router.get("/", validateQueries, async (req, res) => {
  let where = {};
  //name
  if (req.query.name) {
    where.name = req.query.name;
  }
  //type
  if (req.query.type) {
    where.type = req.query.type;
  }
  //startDate
  if (req.query.startDate) {
    where.startDate = req.query.startDate;
  }

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
    where,
    limit: pagination(req.query.page, req.query.size)[0],
    offset: pagination(req.query.page, req.query.size)[1],
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
router.put("/:eventId", requireAuth, validateNewEvent, async (req, res) => {
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

//delete an event
router.delete("/:eventId", requireAuth, async (req, res) => {
  const eventId = req.params.eventId;

  const event = await Event.findOne({
    where: { id: eventId },
  });

  if (!event) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }

  await event.destroy();
  return res.json({ message: "Successfully deleted" });
});
module.exports = router;
