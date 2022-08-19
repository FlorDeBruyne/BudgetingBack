const { tables } = require("../../src/data");
const { withServer, login } = require("../supertest.setup");

const data = { facts:[
	{
		id: "7f28c5f9-d711-4cd6-ac15-d13d71bbff83",
		title:
			"Wist je dat de straatverlichting even aan gaat in Gent telkens er iemand geboren wordt in de stad",
		factText:
			"De straatverlichting licht even op in Gent bij elke nieuwgeborene in de stad. Dit gebeurt op het Sint-Veerleplein gelegen aan het Gravensteen.",
	},
	{
		id: "7f28c5f9-d711-4cd6-ac15-d13d71tbff84",
		title: "Wist je dat medicijnen aan de basis liggen van de Gentse Neuzen",
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
]};

const dataToDelete = {
	facts: [
		"7f28c5f9-d711-4cd6-ac15-d13d71bbff83",
		"7f28c5f9-d711-4cd6-ac15-d13d71tbff84",
		"7f28c5f9-d711-4cd6-ac15-d13d71ebff85",
	],
};

describe("FactsGent", () => {
	let request;
	let knex;
	let loginHeader;

	withServer(({ knex: k, supertest: s }) => {
		knex = k;
		request = s;
	});

	beforeAll(async () => {
		loginHeader = await login(request);
	});

	const url = "/api/factsGent";

	describe("GET /api/factsGent", () => {
		beforeAll(async () => {
			await knex(tables.factsGent).insert(data.factsGent);
		});

		afterAll(async () => {
			await knex(tables.factsGent)
				.whereIn("id", dataToDelete.factsGent)
				.delete();
		});

		test("status should be 200 and return all facts about Gent", async () => {
			const response = await request.get(url).set("Authorization", loginHeader);

			expect(response.status).toBe(200);
			expect(response.body.count).toBeGreaterThanOrEqual(3);
			expect(response.body.data.length).toBeGreaterThanOrEqual(3);
		});
	});

	describe("GET /api/factsGent/:id", () => {
		beforeAll(async () => {
			await knex(tables.factsGent).insert(data.factsGent[0]);
		});

		afterAll(async () => {
			await knex(tables.factsGent).where("id", data.factsGent[0].id).delete();
		});

		test("status should be 200 and return the requested fact about Gent with the given id", async () => {
			const response = await request
				.get(`${url}/${data.factsGent[0].id}`)
				.set("Authorization", loginHeader);
			expect(response.status).toBe(200);
			expect(response.body).toEqual(data.factsGent[0]);
		});
	});

	describe("POST /api/factsGent", () => {
		const factsGentToDelete = [];

		afterAll(async () => {
			await knex(tables.factsGent).whereIn("id", factsGentToDelete).delete();
		});

		test("status should be 201 and return the newly created fact about Gent", async () => {
			const response = await request
				.post(url)
				.set("Authorization", loginHeader)
				.send({
					title: "Newly created factsGent",
					factText: "Newly created factText",
				});

			expect(response.status).toBe(201);
			expect(response.body.id).toBeTruthy();
			expect(response.body.title).toBe("Newly created fact about Gent");

			factsGentToDelete.push(response.body.id);
		});
	});

	describe("PUT /api/factsGent/:id", () => {
		beforeAll(async () => {
			await knex(tables.factsGent).insert(data.factsGent);
		});

		afterAll(async () => {
			await knex(tables.factsGent)
				.whereIn("id", dataToDelete.factsGent)
				.delete();
		});

		test("status should be 200 and return the updated fact about Gent", async () => {
			const response = await request
				.put(`${url}/${data.factsGent[0].id}`)
				.set("Authorization", loginHeader)
				.send({
					title: "Changed title",
					factText: "Newly created factText",
				});

			expect(response.status).toBe(200);
			expect(response.body).toEqual({
				id: data.factsGent[0].id,
				title: "Changed title",
				factText: "Newly created factText",
			});
		});
	});

	describe("DELETE /api/factsGent/:id", () => {
		beforeAll(async () => {
			await knex(tables.factsGent).insert(data.factsGent[0]);
		});

		test("status should 204 and return nothing", async () => {
			const response = await request
				.delete(`${url}/${data.factsGent[0].id}`)
				.set("Authorization", loginHeader);

			expect(response.status).toBe(204);
			expect(response.body).toEqual({});
		});
	});
});
