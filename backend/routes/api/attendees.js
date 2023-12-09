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

  if (await userValidate(req.user.id)) {
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

//request to attend an event
router.post("/:eventId/attendance", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const eventId = req.params.eventId;
  const event = await Event.findByPk(eventId);
  const user = await User.findOne({ where: { id: userId } });
  const membership = await Member.findOne({ where: { userId: userId } });
  const attendance = await Attendee.findOne({
    where: { userId: userId, eventId: eventId },
  });

  //membership couldn't be found
  if (!membership) return res.status(403).json({ message: "Forbidden" });

  //event couldn't be found
  if (!event)
    return res.status(404).json({ message: "Event couldn't be found" });

  //user has pending attendance
  if (attendance && attendance.status == "pending") {
    return res
      .status(400)
      .json({ message: "Attendance has already been requested" });
  }

  //user is already accepted
  if (attendance && attendance.status == "attending") {
    return res
      .status(400)
      .json({ message: "User is already an attendee of the event" });
  }

  if (!attendance) {
    const newAttendance = await Attendee.create({
      userId: userId,
      eventId: eventId,
      status: "pending",
    });
    return res.json({ userId: userId, status: newAttendance.status });
  }

  attendance.status = "pending";
  await attendance.save();

  return res.json({ userId: userId, status: "pending" });
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

  if (!(await userValidate(req.user.id))) {
    return res.status(403).json({ message: "Forbidden" });
  }

  //no event
  if (!event) {
    res.status(404).json({ message: "Event couldn't be found" });
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
  if (attendance.status == "pending") {
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

  const organizerId = group.organizerId;

  if (organizerId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }
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
  await attendee.destroy();
  return res.json({ message: "Successfully deleted attendance from event" });
});

module.exports = router;
