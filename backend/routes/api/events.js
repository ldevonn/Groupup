const express = require("express");
const {
  Attendee,
  Event,
  Group,
  Venue,
  EventImage,
} = require("../../db/models");
const router = express.Router();
const { requireAuth } = require("../../utils/auth.js");
const {
  validateNewEvent,
  validateQueries,
  pagination,
} = require("../../utils/validation.js");

const { userValidate } = require("../../utils/checks.js");
async function getNumAttending(eventId) {
  let numAttending = await Attendee.count({
    where: {
      eventId: eventId,
    },
  });
  return numAttending;
}

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

  if (events.length == 0) {
    return res.json({ events: [] });
  }

  const formattedEvents = await Promise.all(
    events.map(async (event) => {
      const previewImage = event.EventImages.length
        ? event.EventImages[0].url
        : null;
      const numAttending = await getNumAttending(event.id);
      const formattedEvent = {
        id: event.id,
        groupId: event.groupId,
        venueId: event.venueId,
        name: event.name,
        type: event.type,
        startDate: event.startDate,
        endDate: event.endDate,
        numAttending,
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
    })
  );
  return res.json({ Events: formattedEvents });
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

  const numAttending = await getNumAttending(event.id);

  if (typeof event.price === "string") {
    event.price = parseFloat(event.price);
  }

  return res.json({
    id: event.id,
    groupId: event.groupId,
    venueId: event.venueId,
    name: event.name,
    description: event.description,
    type: event.type,
    capacity: event.capacity,
    price: event.price,
    startDate: event.startDate,
    endDate: event.endDate,
    numAttending,
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
  let newImage;
  const eventId = req.params.eventId;

  //finds attendee matching user if exists
  const attendee = await Attendee.findOne({
    where: { userId: req.user.id, eventId: eventId },
  });

  const event = await Event.findByPk(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }

  //if there is an attendee, and they are attending the event
  if (attendee && attendee.status == "attending") {
    newImage = await EventImage.create({
      url,
      eventId,
      preview,
    });
  } else {
    if (!(await userValidate(req.user.id, event.groupId))) {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  newImage = await EventImage.create({
    url,
    eventId,
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
    return res.status(404).json({ message: "Venue couldn't be found" });
  }

  const group = await Group.findByPk(venue.groupId);

  const event = await Event.findByPk(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }

  if (!(await userValidate(req.user.id, group.id))) {
    return res.status(403).json({ message: "Forbidden" });
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
    venueId: event.venueId,
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

  if (!(await userValidate(req.user.id, event.groupId))) {
    return res.status(403).json({ message: "Forbidden" });
  } else {
    await event.destroy();
    return res.json({ message: "Successfully deleted" });
  }
});
module.exports = router;
