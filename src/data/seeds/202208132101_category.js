const { tables } = require("..");

module.exports = {
	seed: async (knex) => {
		await knex(tables.category).delete();

		await knex(tables.category).insert([
			{ id: "7f28c5f9-d711-4cd6-ac15-d13d71abfd83", name: "Housing" },
			{ id: "7f28c5f9-d711-4cd6-ac15-d13d71abfd84", name: "transportation" },
			{ id: "7f28c5f9-d711-4cd6-ac15-d13d71abfd85", name: "Food" },
			{ id: "7f28c5f9-d711-4cd6-ac15-d13d71abfd86", name: "Utilities" },
			{ id: "7f28c5f9-d711-4cd6-ac15-d13d71abfd87", name: "Insurance" },
			{
				id: "7f28c5f9-d711-4cd6-ac15-d13d71abfd88",
				name: "Medical & Healthcare",
			},
			{
				id: "7f28c5f9-d711-4cd6-ac15-d13d71abfd89",
				name: "Saving, Investing & Debt Payments",
			},
			{ id: "7f28c5f9-d711-4cd6-ac15-d13d71abfd90", name: "Personal Spending" },
			{
				id: "7f28c5f9-d711-4cd6-ac15-d13d71abfd91",
				name: "recreation & Entertainment",
			},
			{ id: "7f28c5f9-d711-4cd6-ac15-d13d71abfd92", name: "Miscellaneous" },
		]);
	},
};
