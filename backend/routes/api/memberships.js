const express = require("express");
const { Group, Member, User } = require("../../db/models");
const { Sequelize, Op } = require("sequelize");
const router = express.Router();
const { requireAuth } = require("../../utils/auth.js");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation.js");

//get all members of group
router.get("/:groupId/members", requireAuth, async (req, res) => {
  const groupId = req.params.groupId;
  const organizerId = req.user.id;
  const group = await Group.findByPk(groupId);

  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  let members = undefined;
  if (group.organizerId !== organizerId) {
    members = await Member.findAll({
      where: {
        groupId: groupId,
        status: {
          [Op.not]: "pending",
        },
      },
      include: [
        {
          model: User,
          attributes: ["firstName", "lastName"],
        },
      ],
    });
  } else {
    members = await Member.findAll({
      where: {
        groupId: groupId,
      },
      include: [
        {
          model: User,
          attributes: ["firstName", "lastName"],
        },
      ],
    });
  }

  const formattedMembers = members.map((member) => ({
    id: member.id,
    firstName: member.User.firstName,
    lastName: member.User.lastName,
    Membership: {
      status: member.status,
    },
  }));

  res.json({ Members: formattedMembers });
});

//request membership
router.post("/:groupId/membership", requireAuth, async (req, res) => {
  const groupId = req.params.groupId;
  const group = await Group.findByPk(groupId);
  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  //checks for existing pending status
  const pendingExists = await Member.findOne({
    where: {
      groupId: groupId,
      userId: req.user.id,
      status: "pending",
    },
  });
  if (pendingExists) {
    return res
      .status(400)
      .json({ message: "Membership has already been requested" });
  }

  //checks for existing membership status
  const membershipExists = await Member.findOne({
    where: {
      groupId: groupId,
      userId: req.user.id,
      status: "member",
    },
  });
  if (membershipExists) {
    return res
      .status(400)
      .json({ message: "User is already a member of the group" });
  }

  const newMembership = await Member.create({
    groupId: groupId,
    userId: req.user.id,
    status: "pending",
  });

  res.json({
    userId: newMembership.userId,
    status: newMembership.status,
  });
});

//delete membership
router.delete(
  "/:groupId/membership/:memberId",
  requireAuth,
  async (req, res) => {
    const groupId = req.params.groupId;
    const memberId = req.params.memberId;

    // Check if the user exists
    const user = await User.findByPk(memberId);
    if (!user) {
      return res.status(404).json({ message: "User couldn't be found" });
    }

    // Check if the group exists
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group couldn't be found" });
    }

    // Check if the membership exists
    const membership = await Member.findOne({
      where: {
        groupId: groupId,
        userId: memberId,
      },
    });
    if (!membership) {
      return res
        .status(404)
        .json({ message: "Membership does not exist for this User" });
    }

    //check if user is the host or user to be deleted
    if (membership.status == "host" || req.user.id == membership.userId) {
      await membership.destroy();
      res.json({ message: "Successfully deleted membership from group" });
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }
  }
);

//change status of membership for a group specified by id
router.put("/:groupId/membership", requireAuth, async (req, res) => {
  const { memberId, status } = req.body;
  const groupId = req.params.groupId;
  const group = await Group.findByPk(groupId);

  //membership status for user requesting change
  const userMembership = await Member.findOne({
    where: { groupId: groupId, userId: req.user.id },
  });

  //membership status for user recieving change
  const member = await Member.findOne({
    where: { groupId: groupId, userId: memberId },
  });
  //if the user doesn't exist
  const user = await User.findByPk(memberId);
  if (!user) {
    return res.status(404).json({ message: "User couldn't be found" });
  }
  //if group doesn't exist
  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }
  //if member doesn't exist
  if (!member) {
    return res.status(404).json({
      message: "Membership between the user and the group does not exist",
    });
  }
  //if changing membership status to 'pending'
  if (status === "pending") {
    return res.status(400).json({
      message: "Bad Request",
      errors: { status: "Cannot change a membership status to pending" },
    });
  }
  if (status === "member") {
    if (
      group.organizerId == req.user.id ||
      userMembership.status == "co-host"
    ) {
      member.status = "member";
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }
  }
  if (status === "co-host") {
    if (group.organizerId == req.user.id) {
      member.status = "co-host";
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  return res.json({
    id: member.id,
    groupId: parseInt(groupId),
    memberId: member.userId,
    status: member.status,
  });
});

module.exports = router;
