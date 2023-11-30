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
      Group.hasMany(models.GroupImage, {
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
        validate: {
          len: [1, 60],
        },
      },
      about: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          len: [50, 256],
        },
      },
      type: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          isIn: [["Online", "In person"]],
        },
      },
      private: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        validate: {
          isBoolean: true,
        },
      },
      city: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      state: {
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
