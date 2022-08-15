module.exports = {
	up: async (knex) => {
		await knex.schema.createTable("users", (table) => {
			table.uuid("id").primary();

			table.string("surname", 255).notNullable();

			table.string("name", 255).notNullable();

			table.email("email", 255).notNullable();

			table.string("phonenumber", 255).notNullable();

			table.unique("id", "idx_user_id_unique");
		});
	},

	down: (knex) => {
		return knex.schema.dropTableIfExists("users");
	},
};
