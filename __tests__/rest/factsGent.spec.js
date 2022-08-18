const { tables } = require("../../src/data");
const { withServer, login } = require("../supertest.setup");

const data = {};

const dataToDelete = {};

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
