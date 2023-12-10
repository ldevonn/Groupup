const express = require("express");
const { Group, Member, User } = require("../../db/models");
const { Sequelize, Op } = require("sequelize");
const router = express.Router();
const { requireAuth } = require("../../utils/auth.js");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation.js");
const { userValidate } = require("../../utils/checks.js");

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

  const member = await Member.findOne({
    where: {
      groupId: groupId,
      userId: req.user.id,
    },
  });

  //if member doesn't exist
  if (!member) {
    const newMember = await Member.create({
      groupId: groupId,
      userId: req.user.id,
      status: "pending",
    });
    return res.json({ memberId: newMember.id, status: "pending" });
  }
  //if member exists and status is pending
  if (member.status == "pending") {
    return res
      .status(400)
      .json({ message: "Membership has already been requested" });
  }
  //if member exists and status is member or co-host
  if (member.status == "member" || member.status == "co-host") {
    return res
      .status(400)
      .json({ message: "User is already a member of the group" });
  }
});

//delete membership
router.delete(
  "/:groupId/membership/:memberId",
  requireAuth,
  async (req, res) => {
    const groupId = req.params.groupId;
    const memberId = req.params.memberId;

    // Check if the group exists
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group couldn't be found" });
    }

    // Check if the user exists
    const user = await User.findByPk(memberId);
    if (!user) {
      return res.status(404).json({ message: "User couldn't be found" });
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

    if (membership.userId == req.user.id) {
      await membership.destroy();
      res.json({ message: "Successfully deleted membership from group" });
    }

    if (req.user.id !== group.organizerId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await membership.destroy();
    res.json({ message: "Successfully deleted membership from group" });
  }
);

//change status of membership for a group specified by id
router.put("/:groupId/membership", requireAuth, async (req, res) => {
  const { memberId, status } = req.body;
  const groupId = req.params.groupId;
  const group = await Group.findByPk(groupId);
  //if group doesn't exist
  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  //if the user doesn't exist
  const user = await User.findByPk(memberId);
  if (!user) {
    return res.status(404).json({ message: "User couldn't be found" });
  }

  //membership status for user recieving change
  const member = await Member.findOne({
    where: { groupId: groupId, userId: memberId },
  });

  //if member doesn't exist
  if (!member) {
    return res.status(404).json({
      message: "Membership between the user and the group does not exist",
    });
  }
  //if changing membership status to 'pending'
  if (status == "pending") {
    return res.status(400).json({
      message: "Bad Request",
      errors: { status: "Cannot change a membership status to pending" },
    });
  }
  if (status == "member") {
    if (!(await userValidate(req.user.id, member.groupId))) {
      return res.status(403).json({ message: "Forbidden" });
    } else {
      member.status = "member";
    }
  }
  if (status == "co-host") {
    if (req.user.id !== group.organizerId) {
      return res.status(403).json({ message: "Forbidden" });
    } else {
      member.status = "co-host";
    }
  }

  await member.save();

  return res.json({
    id: member.id,
    groupId: parseInt(groupId),
    memberId: member.userId,
    status: member.status,
  });
});

module.exports = router;
