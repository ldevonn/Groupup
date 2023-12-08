"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate(
      [
        {
          firstName: "John",
          lastName: "Smith",
          email: "john.smith@gmail.com",
          username: "JohnSmith",
          hashedPassword: bcrypt.hashSync("secret password"),
        },
        {
          firstName: "Clark",
          lastName: "Adams",
          email: "clark.adams@gmail.com",
          username: "ClarkAdams",
          hashedPassword: bcrypt.hashSync("secret password"),
        },
        {
          firstName: "Jane",
          lastName: "Doe",
          email: "jane.doe@gmail.com",
          username: "JaneDoe",
          hashedPassword: bcrypt.hashSync("secret password"),
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: { [Op.in]: ["JohnSmith", "ClarkAdams"] },
      },
      {}
    );
  },
};
