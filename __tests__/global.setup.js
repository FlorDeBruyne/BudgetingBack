const config = require("config");

const { initializeData, getKnex, tables } = require("../src/data");
const { initializeLogger } = require("../src/core/logger");
const Role = require("../src/core/roles");

module.exports = async () => {
	//creating a connection to the database
	initializeLogger({
		level: config.get("log.level"),
		disabled: config.get("log.disabled"),
	});
	await initializeData();

	const knex = getKnex();

	//test user with password test123
	await knex(tables.user).insert([
		{
			id: "7f28c5f9-d711-4cd6-ac15-d13d71abuu44",
			name: "Test User",
			email: "test.user@test.be",
			password_hash:
				"$2a$16$dSOaY4MOYDbZffVgDOKUs./r76jOhKTtxyTTNf6QsVP4Ry/zZCVU6",
			phonenumber: "0393094094",
			roles: JSON.stringify([Role.USER]),
		},
		{
			id: "7f28c5f9-d711-4cd6-ac15-d13d71abuu55",
			name: "Admin User",
			email: "admin.user@test.be",
			password_hash:
				"$2a$16$dSOaY4MOYDbZffVgDOKUs./r76jOhKTtxyTTNf6QsVP4Ry/zZCVU6",
			phonenumber: "0393094094",
			roles: JSON.stringify([Role.ADMIN]),
		},
	]);
};
