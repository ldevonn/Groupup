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
					url: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.britannica.com%2Fplace%2FLos-Angeles-California&psig=AOvVaw2as7LjVOx03ojkkTKP75MI&ust=1705723267483000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCMCTwL_I6IMDFQAAAAAdAAAAABAD",
					preview: true,
				},
				{
					groupId: 1,
					url: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.britannica.com%2Fplace%2FLos-Angeles-California&psig=AOvVaw2as7LjVOx03ojkkTKP75MI&ust=1705723267483000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCMCTwL_I6IMDFQAAAAAdAAAAABAD",
					preview: false,
				},
			],
			{ validate: true }
		);
	},

	async down(queryInterface, Sequelize) {
		options.tableName = "GroupImages";
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
