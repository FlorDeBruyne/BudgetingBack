const { tables } = require("..");

module.exports = {
	seed: async (knex) => {
		await knex(tables.expense).delete();

		await knex(tables.expense).insert([
			{
				id: "7f28c5f9-d711-4cd6-ac15-d13d71abdf83",
				name: "Breakfast",
				categoryId: "7f28c5f9-d711-4cd6-ac15-d13d71abfd85",
				amount: 30,
				date: "2022-08-13",
				placeId: "7f28c5f9-d711-4cd6-ac15-d13d71abff83",
			},
			{
				id: "7f28c5f9-d711-4cd6-ac15-d13d71abdf84",
				name: "Drinking pub",
				categoryId: "7f28c5f9-d711-4cd6-ac15-d13d71abfd91",
				amount: 130,
				date: "2022-08-14",
				placeId: "7f28c5f9-d711-4cd6-ac15-d13d71abff84",
			},
			{
				id: "7f28c5f9-d711-4cd6-ac15-d13d71abdf85",
				name: "New Phone",
				categoryId: "7f28c5f9-d711-4cd6-ac15-d13d71abfd92",
				amount: 1500,
				date: "2022-08-15",
				placeId: "7f28c5f9-d711-4cd6-ac15-d13d71abff85",
			},
		]);
	},
};
