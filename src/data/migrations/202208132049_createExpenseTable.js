module.exports = {
	up: async (knex) => {
		await knex.schema.createTable("expenses", (table) => {
			table.uuid("id").primary();

			table.double("amount", 255).notNullable();

			table.string("name", 255).notNullable();

			table.string("categoryId", 255).notNullable();

			table.date("date", 255).notNullable();

			table.string("placeId", 255).notNullable();

			table.unique("name", "idx_expense_name_unique");
		});
	},

	down: (knex) => {
		return knex.schema.dropTableIfExists("expenses");
	},
};
