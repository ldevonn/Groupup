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

module.exports = router;
