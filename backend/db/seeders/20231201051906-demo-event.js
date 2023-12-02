"use strict";

const { Event } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Event.bulkCreate(
      [
        {
          groupId: 1,
          venueId: 1,
          name: "Tennis Group First Meet and Greet",
          description:
            "First meet and greet event for the evening tennis on the water group! Join us online for happy times!",
          type: "Online",
          capacity: 10,
          price: 18.5,
          startDate: "2021-11-19 20:00:00",
          endDate: "2021-11-19 22:00:00",
        },
        {
          groupId: 1,
          venueId: 1,
          name: "Tennis Singles",
          description: "Tennis singles",
          type: "In Person",
          capacity: 10,
          price: 13.5,
          startDate: "2021-12-19 20:00:00",
          endDate: "2021-12-19 22:00:00",
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Events";
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
