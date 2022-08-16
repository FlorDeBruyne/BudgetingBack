const { tables } = require("../../data");
const { withServer, login } = require("../supertest.setup");

const data = {
	expenses: [
		{
			id: "7f28c5f9-d711-4cd6-ac15-d13d71abhf10",
			name: "Breakfast",
			categoryId: "7f28c5f9-d711-4cd6-ac15-d13d71abfd85",
			amount: 30,
			date: "2022-08-15",
			placeId: "7f28c5f9-d711-4cd6-ac15-d13d71abff83",
		},
		{
			id: "7f28c5f9-d711-4cd6-ac15-d13d71abif15",
			name: "Drinking pub",
			categoryId: "7f28c5f9-d711-4cd6-ac15-d13d71abfd85",
			amount: 35,
			date: "2022-08-15",
			placeId: "7f28c5f9-d711-4cd6-ac15-d13d71abff83",
		},
		{
			id: "7f28c5f9-d711-4cd6-ac15-d13d71abjf20",
			name: "New Phone",
			categoryId: "7f28c5f9-d711-4cd6-ac15-d13d71abfd85",
			amount: 1069,
			date: "2022-08-15",
			placeId: "7f28c5f9-d711-4cd6-ac15-d13d71abff83",
		},
	],
};

const dataToDelete = {
	expenses: [
		"7f28c5f9-d711-4cd6-ac15-d13d71abhf10",
		"7f28c5f9-d711-4cd6-ac15-d13d71abif15",
		"7f28c5f9-d711-4cd6-ac15-d13d71abjf20",
	],
};

describe("Expenses", () => {
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

	const url = "/api/expenses";

	describe("GET /api/expenses", () => {
		beforeAll(async () => {
			await knex(tables.expense).insert(data.expenses);
		});

		afterAll(async () => {
			await knex(tables.expense).whereIn("id", dataToDelete.expenses).delete();
		});

		test("status should be 200 and return all expenses", async () => {
			const response = await request.get(url).set("Authorization", loginHeader);

			expect(response.status).toBe(200);
			expect(response.body.count).toBeGreaterThanOrEqual(3);
			expect(response.body.data.length).toBeGreaterThanOrEqual(3);
		});
	});

	describe("GET /api/expenses/:id", () => {
		beforeAll(async () => {
			await knex(tables.expense).insert(data.expenses[0]);
		});

		afterAll(async () => {
			await knex(tables.expense).where("id", data.expenses[0].id).delete();
		});

		test("status should be 200 and return the requested expense with the given id", async () => {
			const response = await request
				.get(`${url}/${data.expenses[0].id}`)
				.set("Authorization", loginHeader);
			expect(response.status).toBe(200);
			expect(response.body).toEqual(data.expenses[0]);
		});
	});

	describe("POST /api/expenses", () => {
		const expensesToDelete = [];

		afterAll(async () => {
			await knex(tables.expense).whereIn("id", expensesToDelete).delete();
		});

		test("status should be 201 and return the newly created expense", async () => {
			const response = await request
				.post(url)
				.set("Authorization", loginHeader)
				.send({
					name: "Newly created expense",
					categoryId: "7f28c5f9-d711-4cd6-ac15-d13d71abfd86",
					amount: 420,
					date: "2022-08-14",
					placeId: "7f28c5f9-d711-4cd6-ac15-d13d71abff84",
				});

			expect(response.status).toBe(201);
			expect(response.body.id).toBeTruthy();
			expect(response.body.name).toBe("Newly created expense");
			expect(response.body.categoryId).toBe(
				"7f28c5f9-d711-4cd6-ac15-d13d71abfd86"
			);
			expect(response.body.amount).toBe(420);
			expect(response.body.data).toBe("2022-08-14");
			expect(response.body.placeId).toBe(
				"7f28c5f9-d711-4cd6-ac15-d13d71abff84"
			);

			expensesToDelete.push(response.body.id);
		});
	});

	describe("PUT /api/expenses/:id", () => {
		beforeAll(async () => {
			await knex(tables.expense).insert(data.expenses);
		});

		afterAll(async () => {
			await knex(tables.expense).whereIn("id", dataToDelete.expenses).delete();
		});

		test("status should be 200 and return the updated expense", async () => {
			const response = await request
				.put(`${url}/${data.expenses[0].id}`)
				.set("Authorization", loginHeader)
				.send({
					name: "Changed name",
					amount: 69,
				});

			expect(response.status).toBe(200);
			expect(response.body).toEqual({
				id: data.expenses[0].id,
				name: "Changed name",
				categoryId: "7f28c5f9-d711-4cd6-ac15-d13d71abfd85",
				amount: 69,
				date: "2022-08-15",
				placeId: "7f28c5f9-d711-4cd6-ac15-d13d71abff83",
			});
		});
	});

	describe("DELETE /api/expenses/:id", () => {
		beforeAll(async () => {
			await knex(tables.expense).insert(data.expenses[0]);
		});

		test("status should 204 and return nothing", async () => {
			const response = await request
				.delete(`${url}/${data.expenses[0].id}`)
				.set("Authorization", loginHeader);

			expect(response.status).toBe(204);
			expect(response.body).toEqual({});
		});
	});
});
