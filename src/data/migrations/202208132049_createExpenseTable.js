module.exports = {
	up: async (knex) => {
		await knex.schema.createTable("expenses", (table) => {
			table.uuid("id").primary();

			table.double("amount", 255).notNullable();

			table.string("name", 255).notNullable();

			table.uuid("categoryId").notNullable();

			table.dateTime("date").notNullable();

			table.uuid("placeId").notNullable();

			// table.uuid("userId").notNullable(); later

			table
				.foreign("categoryId", "fk_expense_category")
				.reference(`${tables.category}.id`)
				.onDelete("CASCADE");

			table
				.foreign("placeId", "fk_expense_place")
				.reference(`${tables.place}.id`)
				.onDelete("CASCADE");

			// not this evening
			// table
			// 	.foreign("userId", "fk_expense_user")
			// 	.reference(`${tables.user}.id`)
			// 	.onDelete("CASCADE");

			table.unique("name", "idx_expense_name_unique");
		});
	},

	down: (knex) => {
		return knex.schema.dropTableIfExists("expenses");
	},
};
