const { tables } = require("..");
const Role = require("../../core/roles");

module.exports = {
	seed: async (knex) => {
		await knex(tables.user).delete();
		// all passwords are test123
		await knex(tables.user).insert([
			{
				id: "7f28c5f9-d711-4cd6-ac15-d13d71abuu11",
				surname: "Doe",
				name: "Jhon",
				email: "JhonDoe@email.com",
				password_hash:
					"$2a$16$dSOaY4MOYDbZffVgDOKUs./r76jOhKTtxyTTNf6QsVP4Ry/zZCVU6",
				phonenumber: "0393094094",
				roles: JSON.stringify([Role.ADMIN, Role.USER]),
			},
			{
				id: "7f28c5f9-d711-4cd6-ac15-d13d71abuu22",
				surname: "Doe",
				name: "Jane",
				email: "JaneDoe@email.com",
				password_hash:
					"$2a$16$dSOaY4MOYDbZffVgDOKUs./r76jOhKTtxyTTNf6QsVP4Ry/zZCVU6",
				phonenumber: "0393094094",
				roles: JSON.stringify([Role.ADMIN, Role.USER]),
			},
			{
				id: "7f28c5f9-d711-4cd6-ac15-d13d71abuu33",
				surname: "De Bruyne",
				name: "Flor",
				email: "FlorDeBruyne@email.com",
				password_hash:
					"$2a$16$dSOaY4MOYDbZffVgDOKUs./r76jOhKTtxyTTNf6QsVP4Ry/zZCVU6",
				phonenumber: "0393094094",
				roles: JSON.stringify([Role.ADMIN, Role.USER]),
			},
		]);
	},
};
