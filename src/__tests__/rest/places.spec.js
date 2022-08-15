const { tables } = require("../../data");
const { withServer, login } = require("../supertest.setup");

const data = {
	places: [
		{
			id: "7f28c5f9-d711-4cd6-ac15-d13d71abdf69",
			name: "Carrefour",
		},
		{
			id: "7f28c5f9-d711-4cd6-ac15-d13d71abef79",
			name: "Marimain",
		},
		{
			id: "7f28c5f9-d711-4cd6-ac15-d13d71abgf89",
			name: "Coolblue",
		},
	],
};

const dataToDelete = {
	places: [
		"7f28c5f9-d711-4cd6-ac15-d13d71abdf69",
		"7f28c5f9-d711-4cd6-ac15-d13d71abef79",
		"7f28c5f9-d711-4cd6-ac15-d13d71abgf89",
	],
};

describe("Places", () => {
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

	const url = "/api/places";

	describe("GET /api/places", () => {
		beforeAll(async () => {
			await knex(tables.place).insert(data.places);
		});

		afterAll(async () => {
			await knex(tables.place).whereIn("id", dataToDelete.places).delete();
		});

		test("status should be 200 and return all places", async () => {
			const response = await request.get(url).set("Authorization", loginHeader);

			expect(response.status).toBe(200);
			expect(response.body.count).toBeGreaterThanOrEqual(3);
			expect(response.body.data.length).toBeGreaterThanOrEqual(3);
		});
	});

	describe("GET /api/places/:id", () => {
		beforeAll(async () => {
			await knex(tables.place).insert(data.places[0]);
		});

		afterAll(async () => {
			await knex(tables.place).where("id", data.places[0].id).delete();
		});

		test("status should be 200 and return the requested place with the given id", async () => {
			const response = await request
				.get(`${url}/${data.places[0].id}`)
				.set("Authorization", loginHeader);
			expect(response.status).toBe(200);
			expect(response.body).toEqual(data.places[0]);
		});
	});

	describe("POST /api/places", () => {
		const placesToDelete = [];

		afterAll(async () => {
			await knex(tables.place).whereIn("id", placesToDelete).delete();
		});

		test("status should be 201 and return the newly created place", async () => {
			const response = await request
				.post(url)
				.set("Authorization", loginHeader)
				.send({
					name: "Newly created place",
				});

			expect(response.status).toBe(201);
			expect(response.body.id).toBeTruthy();
			expect(response.body.name).toBe("Newly created place");

			placesToDelete.push(response.body.id);
		});
	});

	describe("PUT /api/places/:id", () => {
		beforeAll(async () => {
			await knex(tables.place).insert(data.places);
		});

		afterAll(async () => {
			await knex(tables.place).whereIn("id", dataToDelete.places).delete();
		});

		test("status should be 200 and return the updated place", async () => {
			const response = await request
				.put(`${url}/${data.places[0].id}`)
				.set("Authorization", loginHeader)
				.send({
					name: "Changed name",
				});

			expect(response.status).toBe(200);
			expect(response.body).toEqual({
				id: data.places[0].id,
				name: "Changed name",
			});
		});
	});

	describe("DELETE /api/places/:id", () => {
		beforeAll(async () => {
			await knex(tables.place).insert(data.places[0]);
		});

		test("status should 204 and return nothing", async () => {
			const response = await request
				.delete(`${url}/${data.places[0].id}`)
				.set("Authorization", loginHeader);

			expect(response.status).toBe(204);
			expect(response.body).toEqual({});
		});
	});
});
