"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    static associate(models) {
      Venue.belongsTo(models.Group, { foreignKey: "groupId" });
    }
  }
  Venue.init(
    {
      groupId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      address: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      city: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      state: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      lat: {
        allowNull: false,
        type: DataTypes.DECIMAL,
        validate: {
          isFloat: { min: -90, max: 90 },
        },
      },
      lng: {
        allowNull: false,
        type: DataTypes.DECIMAL,
        validate: {
          isFloat: { min: -180, max: 180 },
        },
      },
    },
    {
      sequelize,
      modelName: "Venue",
    }
  );
  return Venue;
};
