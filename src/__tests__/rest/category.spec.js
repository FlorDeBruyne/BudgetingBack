const { tables } = require("../../data");
const { withServer, login } = require("../supertest.setup");

const data = {
	
};

const dataToDelete = {
	
};

describe("Categorys", () => {
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

	const url = "/api/categorys";

	describe("GET /api/categorys", () => {
		beforeAll(async () => {
			await knex(tables.category).insert(data.categorys);
		});

		afterAll(async () => {
			await knex(tables.category)
				.whereIn("id", dataToDelete.categorys)
				.delete();
		});

		test("status should be 200 and return all categorys", async () => {
			const response = await request.get(url).set("Authorization", loginHeader);

			expect(response.status).toBe(200);
			expect(response.body.count).toBeGreaterThanOrEqual(3);
			expect(response.body.data.length).toBeGreaterThanOrEqual(3);
		});
	});

	describe("GET /api/categorys/:id", () => {
		beforeAll(async () => {
			await knex(tables.category).insert(data.categorys[0]);
		});

		afterAll(async () => {
			await knex(tables.category).where("id", data.categorys[0].id).delete();
		});

		test("status should be 200 and return the requested category with the given id", async () => {
			const response = await request
				.get(`${url}/${data.categorys[0].id}`)
				.set("Authorization", loginHeader);
			expect(response.status).toBe(200);
			expect(response.body).toEqual(data.categorys[0]);
		});
	});

	describe("POST /api/categorys", () => {
		const categorysToDelete = [];

		afterAll(async () => {
			await knex(tables.category).whereIn("id", categorysToDelete).delete();
		});

		test("status should be 201 and return the newly created category", async () => {
			const response = await request
				.post(url)
				.set("Authorization", loginHeader)
				.send({
					name: "Newly created category",
				});

			expect(response.status).toBe(201);
			expect(response.body.id).toBeTruthy();
			expect(response.body.name).toBe("Newly created category");

			categorysToDelete.push(response.body.id);
		});
	});

	describe("PUT /api/categorys/:id", () => {
		beforeAll(async () => {
			await knex(tables.category).insert(data.categorys);
		});

		afterAll(async () => {
			await knex(tables.category)
				.whereIn("id", dataToDelete.categorys)
				.delete();
		});

		test("status should be 200 and return the updated category", async () => {
			const response = await request
				.put(`${url}/${data.categorys[0].id}`)
				.set("Authorization", loginHeader)
				.send({
					name: "Changed name",
				});

			expect(response.status).toBe(200);
			expect(response.body).toEqual({
				id: data.categorys[0].id,
				name: "Changed name",
			});
		});
	});

	describe("DELETE /api/categorys/:id", () => {
		beforeAll(async () => {
			await knex(tables.category).insert(data.categorys[0]);
		});

		test("status should 204 and return nothing", async () => {
			const response = await request
				.delete(`${url}/${data.categorys[0].id}`)
				.set("Authorization", loginHeader);

			expect(response.status).toBe(204);
			expect(response.body).toEqual({});
		});
	});
});
