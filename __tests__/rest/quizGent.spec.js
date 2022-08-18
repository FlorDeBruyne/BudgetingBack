const { tables } = require("../../src/data");
const { withServer, login } = require("../supertest.setup");

const data = {};

const dataToDelete = {};

describe("quizGent", () => {
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

	const url = "/api/quizGent";

	describe("GET /api/quizGent", () => {
		beforeAll(async () => {
			await knex(tables.quizGent).insert(data.quizGent);
		});

		afterAll(async () => {
			await knex(tables.quizGent).whereIn("id", dataToDelete.quizGent).delete();
		});

		test("status should be 200 and return all quiz about Gent", async () => {
			const response = await request.get(url).set("Authorization", loginHeader);

			expect(response.status).toBe(200);
			expect(response.body.count).toBeGreaterThanOrEqual(3);
			expect(response.body.data.length).toBeGreaterThanOrEqual(3);
		});
	});

	describe("GET /api/quizGent/:id", () => {
		beforeAll(async () => {
			await knex(tables.quizGent).insert(data.quizGent[0]);
		});

		afterAll(async () => {
			await knex(tables.quizGent).where("id", data.quizGent[0].id).delete();
		});

		test("status should be 200 and return the requested fact about Gent with the given id", async () => {
			const response = await request
				.get(`${url}/${data.quizGent[0].id}`)
				.set("Authorization", loginHeader);
			expect(response.status).toBe(200);
			expect(response.body).toEqual(data.quizGent[0]);
		});
	});

	describe("POST /api/quizGent", () => {
		const quizGentToDelete = [];

		afterAll(async () => {
			await knex(tables.quizGent).whereIn("id", quizGentToDelete).delete();
		});

		test("status should be 201 and return the newly created fact about Gent", async () => {
			const response = await request
				.post(url)
				.set("Authorization", loginHeader)
				.send({
					vraag: "Newly created quizGent",
					antwoord: "Newly created antwoord",
				});

			expect(response.status).toBe(201);
			expect(response.body.id).toBeTruthy();
			expect(response.body.vraag).toBe("Newly created fact about Gent");

			quizGentToDelete.push(response.body.id);
		});
	});

	describe("PUT /api/quizGent/:id", () => {
		beforeAll(async () => {
			await knex(tables.quizGent).insert(data.quizGent);
		});

		afterAll(async () => {
			await knex(tables.quizGent).whereIn("id", dataToDelete.quizGent).delete();
		});

		test("status should be 200 and return the updated fact about Gent", async () => {
			const response = await request
				.put(`${url}/${data.quizGent[0].id}`)
				.set("Authorization", loginHeader)
				.send({
					vraag: "Changed vraag",
					antwoord: "Newly created antwoord",
				});

			expect(response.status).toBe(200);
			expect(response.body).toEqual({
				id: data.quizGent[0].id,
				vraag: "Changed vraag",
				antwoord: "Newly created antwoord",
			});
		});
	});

	describe("DELETE /api/quizGent/:id", () => {
		beforeAll(async () => {
			await knex(tables.quizGent).insert(data.quizGent[0]);
		});

		test("status should 204 and return nothing", async () => {
			const response = await request
				.delete(`${url}/${data.quizGent[0].id}`)
				.set("Authorization", loginHeader);

			expect(response.status).toBe(204);
			expect(response.body).toEqual({});
		});
	});
});
