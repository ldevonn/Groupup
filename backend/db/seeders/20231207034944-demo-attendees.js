"use strict";

const { Attendee } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Attendee.bulkCreate(
      [
        {
          eventId: 1,
          userId: 2,
          status: "attending",
        },
        {
          eventId: 1,
          userId: 1,
          status: "waitlist",
        },
        {
          eventId: 1,
          userId: 3,
          status: "pending",
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Attendees";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        eventId: { [Op.in]: [1] },
      },
      {}
    );
  },
};
