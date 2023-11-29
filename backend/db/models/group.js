"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      Group.belongsTo(models.User, { foreignKey: "organizerId" });
      Group.hasMany(models.Member, {
        foreignKey: "groupId",
        onDelete: "CASCADE",
      });
    }
  }
  Group.init(
    {
      organizerId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      about: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      type: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      private: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
      city: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      state: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      previewImage: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Group",
      defaultScope: {
        attributes: [
          "id",
          "organizerId",
          "name",
          "about",
          "type",
          "private",
          "city",
          "state",
          "createdAt",
          "updatedAt",
          "previewImage",
        ],
      },
    }
  );

  Group.addScope("withMemberCount", {
    attributes: {
      include: [
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM "Members" WHERE "Members"."groupId" = "Group"."id")'
          ),
          "numMembers",
        ],
      ],
    },
  });

  return Group;
};
