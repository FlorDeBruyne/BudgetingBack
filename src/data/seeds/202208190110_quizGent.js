const { tables } = require("..");

module.exports = {
	seed: async (knex) => {
		await knex(tables.quizGent).delete();

		await knex(tables.quizGent).insert([
			{
				id: "7f28c5f9-d711-4cd6-ac15-d13d71abfk83",
				vraag: "Wat is de oppervlakte van Gent?",
				antwoord: "15774 vierkante kilometer",
			},
			{
				id: "7f28c5f9-d711-4cd6-ac15-d13d71abkf84",
				vraag: "Hoeveel inwoners heeft Gent?",
				antwoord: "265086",
			},
			{
				id: "7f28c5f9-d711-4cd6-ac15-d13d71abhf85",
				vraag: "Wie is de burgemeester van Gent?",
				antwoord: "Mathias De Clercq",
			},
		]);
	},
};
