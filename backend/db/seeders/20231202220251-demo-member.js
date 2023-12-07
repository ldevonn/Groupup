"use strict";

const { Member } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Member.bulkCreate(
      [
        {
          userId: 1,
          groupId: 1,
          status: "member",
        },
        {
          userId: 2,
          groupId: 1,
          status: "co-host",
        },
        {
          userId: 3,
          groupId: 1,
          status: "pending",
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Members";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        groupId: { [Op.in]: [1] },
      },
      {}
    );
  },
};
