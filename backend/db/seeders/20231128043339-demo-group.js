"use strict";

const { Group } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
	async up(queryInterface, Sequelize) {
		await Group.bulkCreate(
			[
				{
					organizerId: 1,
					name: "Evening Tennis on the Water",
					about:
						"Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
					type: "In person",
					private: true,
					city: "New York",
					state: "NY",
					createdAt: "2021-11-19 20:39:36",
					updatedAt: "2021-11-19 20:39:36",
				},
				{
					organizerId: 1,
					name: "Evening Golf",
					about: "Enjoy an evening of golf with likeminded individuals",
					type: "In person",
					private: true,
					city: "New York",
					state: "NY",
					createdAt: "2021-11-19 20:39:36",
					updatedAt: "2021-11-19 20:39:36",
				},
				{
					organizerId: 1,
					name: "Evening Basketball",
					about: "Enjoy an evening of basketball with likeminded individuals",
					type: "In person",
					private: true,
					city: "New York",
					state: "NY",
					createdAt: "2021-11-19 20:39:36",
					updatedAt: "2021-11-19 20:39:36",
				},
			],
			{ validate: true }
		);
	},

	async down(queryInterface, Sequelize) {
		options.tableName = "Groups";
		const Op = Sequelize.Op;
		return queryInterface.bulkDelete(
			options,
			{
				name: { [Op.in]: ["Evening Tennis on the Water"] },
			},
			{}
		);
	},
};
