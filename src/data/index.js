const config = require("config");
const knex = require("knex");
const { logger } = require("get-logger/lib/getConsoleLogger");

const NODE_ENV = process.env.NODE_ENV; //config.get("env") doesn't work
const isDevelopment = NODE_ENV === "development";

const DATABASE_CLIENT = config.get("database.client");
const DATABASE_NAME = config.get("database.name");
const DATABASE_HOST = config.get("database.host");
const DATABASE_PORT = config.get("database.port");
const DATABASE_USERNAME = config.get("database.username");
const DATABASE_PASSWORD = config.get("database.password");

let knexInstance;

async function initializeData() {
	const knexOptions = {
		client: DATABASE_CLIENT,
		connection: {
			host: DATABASE_HOST,
			port: DATABASE_PORT,
			database: DATABASE_NAME,
			user: DATABASE_USERNAME,
			password: DATABASE_PASSWORD,
			insecureAutyh: isDevelopment,
		},
	};
	knexInstance = knex(knexOptions);

	try {
		await knexInstance.raw("SELECT 1+1 AS result");
	} catch (error) {
		// logger.error(error.message, { error });
		throw new Error("could not initialize the data layer");
	}

	return knexInstance;
}

function getKnex() {
	if (!knexInstance)
		throw new Error(
			"please initialize the data layer before getting the knex instance"
		);
	return knexInstance;
}

const tables = Object.freeze({
	expense: "expense",
	place: "place",
	category: "category",
});

module.exports = {
	initializeData,
	tables,
	getKnex,
};
