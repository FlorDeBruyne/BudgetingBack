module.exports = {
	up: async (knex) => {
		await knex.schema.createTable("factsGent", (table) => {
			table.uuid("id").primary();

			table.string("title", 255).notNullable();

			table.string("factText", 500).notNullable();

			table.unique("title", "idx_factsGent_title_unique");
		});
	},

	down: (knex) => {
		return knex.schema.dropTableIfExists("factsGent");
	},
};
