"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Events",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        venueId: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        groupId: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        description: {
          allowNull: false,
          type: Sequelize.TEXT,
        },
        type: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        capacity: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        price: {
          allowNull: false,
          type: Sequelize.DECIMAL,
        },
        startDate: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        endDate: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      options
    );
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Events";
    return queryInterface.dropTable(options);
  },
};
