const express = require("express");
const { Attendee, Event, User, Member, Group } = require("../../db/models");
const router = express.Router();
const { Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth.js");
const {
  validateNewEvent,
  validateQueries,
  pagination,
} = require("../../utils/validation.js");

const { userValidate } = require("../../utils/checks.js");

//get all attendees of an event
router.get("/:eventId/attendees", async (req, res) => {
  const eventId = req.params.eventId;
  const event = await Event.findByPk(eventId);

  if (!event) {
    res.status(404).json({ message: "Event couldn't be found" });
  }

  let attendees;

  if (await userValidate(req.user.id, event.groupId)) {
    attendees = await Attendee.findAll({
      where: { eventId: eventId },
      include: [{ model: User, attributes: ["id", "firstName", "lastName"] }],
    });
  } else {
    attendees = await Attendee.findAll({
      where: { eventId: eventId, status: { [Op.not]: "pending" } },
      include: [{ model: User, attributes: ["id", "firstName", "lastName"] }],
    });
  }
  const formattedAttendees = attendees.map((attendee) => {
    return {
      id: attendee.User.id,
      firstName: attendee.User.firstName,
      lastName: attendee.User.lastName,
      Attendance: {
        status: attendee.status,
      },
    };
  });
  res.json({ Attendees: formattedAttendees });
});

// //request to attend an event
router.post("/:eventId/attendance", requireAuth, async (req, res) => {
  const permissable = ["member", "co-host"];
  const userId = req.user.id;
  const eventId = req.params.eventId;
  const event = await Event.findByPk(eventId);

  //event couldn't be found
  if (!event)
    return res.status(404).json({ message: "Event couldn't be found" });

  const membership = await Member.findOne({
    where: { userId: userId, groupId: event.groupId },
  });
  const attendee = await Attendee.findOne({
    where: { userId: userId, eventId: eventId },
  });
  //if member doesn't exist
  if (!membership) return res.status(403).json({ message: "Forbidden" });

  //if member status is permissable
  if (permissable.includes(membership.status)) {
    console.log("i got here");
    //user has pending attendance
    if (attendee && attendee.status == "pending") {
      return res
        .status(400)
        .json({ message: "Attendance has already been requested" });
    }
    //user is already accepted
    if (attendee && attendee.status == "attending") {
      return res
        .status(400)
        .json({ message: "User is already an attendee of the event" });
    }
    if (!attendee) {
      const newAttendance = await Attendee.create({
        userId: userId,
        eventId: eventId,
        status: "pending",
      });
      return res.json({ userId: userId, status: newAttendance.status });
    }
  } else {
    return res.status(403).json({ message: "Forbidden" });
  }
});

//change status of an attendance
router.put("/:eventId/attendance", requireAuth, async (req, res) => {
  const eventId = req.params.eventId;
  const { userId, status } = req.body;
  const attendance = await Attendee.findOne({
    where: { userId: userId, eventId: eventId },
  });
  const user = await User.findOne({ where: { id: userId } });
  const event = await Event.findOne({ where: { id: eventId } });
  //no event
  if (!event) {
    res.status(404).json({ message: "Event couldn't be found" });
  }

  if (!(await userValidate(req.user.id, event.groupId))) {
    return res.status(403).json({ message: "Forbidden" });
  }

  //no user
  if (!user) {
    res.status(404).json({ message: "User couldn't be found" });
  }

  // attendance couldn't be found
  if (!attendance || attendance.status == "waitlist") {
    res.status(404).json({
      message: "Attendance between the user and the event does not exist",
    });
  }

  //attendance status is pending
  if (status == "pending") {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        status: "Cannot change an attendance status to pending",
      },
    });
  }

  attendance.status = status;
  await attendance.save();

  return res.json({
    id: attendance.id,
    eventId: attendance.eventId,
    userId: attendance.userId,
    status: attendance.status,
  });
});

//delete attendance
router.delete("/:eventId/attendance/:userId", requireAuth, async (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.params.userId;
  const user = await User.findOne({ where: { id: userId } });
  const event = await Event.findOne({ where: { id: eventId } });
  const attendee = await Attendee.findOne({
    where: { userId: req.params.userId },
  });

  //event couldn't be found
  if (!event) {
    res.status(404).json({ message: "Event couldn't be found" });
  }

  const group = await Group.findOne({
    where: { id: event.groupId },
  });

  //user couldn't be found
  if (!user) {
    res.status(404).json({ message: "User couldn't be found" });
  }

  //attendance couldn't be found
  if (!attendee || attendee.status == "waitlist") {
    res
      .status(404)
      .json({ message: "Attendance does not exist for this user" });
  }
  //validate user

  //own attendance
  if (attendee.userId == req.user.id) {
    await attendee.destroy();
    return res.json({ message: "Successfully deleted attendance from event" });
  }

  if (req.user.id !== group.organizerId) {
    return res.status(403).json({ message: "Forbidden" });
  }
});

module.exports = router;
