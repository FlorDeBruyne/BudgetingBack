const { tables } = require("..");

module.exports = {
	seed: async (knex) => {
		await knex(tables.factsGent).delete();

		await knex(tables.factsGent).insert([
			{
				id: "7f28c5f9-d711-4cd6-ac15-d13d71bbff83",
				title:
					"Wist je dat de straatverlichting even aan gaat in Gent telkens er iemand geboren wordt in de stad",
				factText:
					"De straatverlichting licht even op in Gent bij elke nieuwgeborene in de stad. Dit gebeurt op het Sint-Veerleplein gelegen aan het Gravensteen.",
			},
			{
				id: "7f28c5f9-d711-4cd6-ac15-d13d71tbff84",
				title:
					"Wist je dat medicijnen aan de basis liggen van de Gentse Neuzen",
				factText:
					"Het recept voor deze lekkernij zou per toeval ontdekt zijn geweest door een Gentse apotheker. Hij was op zoek naar een manier om zijn medicijnen langer te bewaren.",
			},
			{
				id: "7f28c5f9-d711-4cd6-ac15-d13d71ebff85",
				title:
					"Wist je dat stoofvlees gemaakt werd van bedorven vlees in de Middeleeuwen?",
				factText:
					"Destijds was er nog onvoldoende kennis en materiaal voorhanden om vlees op een goede manier te bewaren.",
			},
		]);
	},
};
