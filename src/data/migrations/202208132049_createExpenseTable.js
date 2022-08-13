module.exports = {
	up: async (knex) => {
		await knex.schema.createTable("expenses", (table) => {
			table.uuid("id").primary();

			table.string("name", 255).notNullable();

			table.unique("name", "idx_expense_name_unique");
		});
	},

	down: (knex) => {
		return knex.schema.dropTableIfExists("expenses");
	},
};
