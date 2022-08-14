const { tables } = require("..");

module.exports = {
	seed: async (knex) => {
		await knex(tables.user).delete();

		await knex(tables.user).insert([
			{
				id: "7f28c5f9-d711-4cd6-ac15-d13d71abuu11",
				surname: "Doe",
				name: "Jhon",
				email: "JhonDoe@email.com",
				password: "Azerty123!",
				phone: "0393094094",
			},
			{
				id: "7f28c5f9-d711-4cd6-ac15-d13d71abuu22",
				surname: "Doe",
				name: "Jane",
				email: "JaneDoe@email.com",
				password: "Azerty123!",
				phone: "0393094094",
			},
			{
				id: "7f28c5f9-d711-4cd6-ac15-d13d71abuu33",
				surname: "De Bruyne",
				name: "Flor",
				email: "FlorDeBruyne@email.com",
				password: "Azerty123!",
				phone: "0393094094",
			},
		]);
	},
};
