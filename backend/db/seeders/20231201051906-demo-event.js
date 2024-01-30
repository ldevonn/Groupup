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
					venueId: null,
					name: "Tennis Group January Meet and Greet for Doubles",
					description:
						"First meet and greet event for the evening tennis on the water group! Join us online for happy times!",
					type: "In Person",
					capacity: 10,
					price: 18.5,
					startDate: "2024-01-16 18:00:00",
					endDate: "2024-01-16 20:00:00",
				},
				{
					groupId: 1,
					venueId: 1,
					name: "Tennis Group March Meet and Greet for Doubles",
					description:
						"First meet and greet event for the evening tennis on the water group! Join us online for happy times!",
					type: "In Person",
					capacity: 10,
					price: 18.5,
					startDate: "2024-03-16 18:00:00",
					endDate: "2024-01-16 20:00:00",
				},
				{
					groupId: 1,
					venueId: null,
					name: "Tennis Group February Meet and Greet for Doubles",
					description:
						"First meet and greet event for the evening tennis on the water group! Join us online for happy times!",
					type: "In Person",
					capacity: 10,
					price: 18.5,
					startDate: "2024-02-16 18:00:00",
					endDate: "2024-01-16 20:00:00",
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
