module.exports = {
	seed: async (knex) => {
		await knex("places").delete();

		await knex("places").insert([
			{ id: "7f28c5f9-d711-4cd6-ac15-d13d71abff83", name: "Carrefour" },
			{ id: "7f28c5f9-d711-4cd6-ac15-d13d71abff84", name: "Marimain" },
			{ id: "7f28c5f9-d711-4cd6-ac15-d13d71abff85", name: "Coolblue" },
		]);
	},
};
