"use strict";

const { GroupImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await GroupImage.bulkCreate(
      [
        {
          groupId: 1,
          url: "image url",
          preview: true,
        },
        {
          groupId: 1,
          url: "image url",
          preview: false,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      "GroupImage", // Set the table name directly here
      {
        url: { [Op.in]: ["image url"] },
      },
      {}
    );
  },
};
