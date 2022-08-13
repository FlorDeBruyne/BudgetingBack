module.exports = {
	up: async (knex) => {
		await knex.schema.createTable("categories", (table) => {
			table.uuid("id").primary();

			table.string("name", 255).notNullable();

			table.unique("name", "idx_category_name_unique");
		});
	},

	down: (knex) => {
		return knex.schema.dropTableIfExists("categories");
	},
};
