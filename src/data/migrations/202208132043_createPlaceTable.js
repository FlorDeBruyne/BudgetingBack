module.exports = {
	up: async (knex) => {
		await knex.schema.createTable("places", (table) => {
			table.uuid("id").primary();

			table.string("name", 255).notNullable();

			table.unique("name", "idx_place_name_unique");
		});
	},

	down: (knex) => {
		return knex.schema.dropTableIfExists("places");
	},
};
