const config = require("config");
const knex = require("knex");
const { getChildLogger } = require("../core/logger");
const { join } = require("path");

//const NODE_ENV = config.get('env'); //config.get("env") doesn't work
const isDevelopment = true; //NODE_ENV === "development";

const DATABASE_CLIENT = config.get("database.client");
const DATABASE_NAME = config.get("database.name");
const DATABASE_HOST = config.get("database.host");
const DATABASE_PORT = config.get("database.port");
const DATABASE_USERNAME = config.get("database.username");
const DATABASE_PASSWORD = config.get("database.password");

let knexInstance;

async function initializeData() {
	const logger = getChildLogger("database");
	logger.info("initialize connection to database");

	const knexOptions = {
		client: DATABASE_CLIENT,
		connection: {
			host: DATABASE_HOST,
			port: DATABASE_PORT,
			// database: DATABASE_NAME,
			user: DATABASE_USERNAME,
			password: DATABASE_PASSWORD,
			insecureAuth: isDevelopment,
		},
		migrations: {
			tableName: "knex_meta",
			directory: join("src", "data", "migrations"),
		},
		seeds: {
			directory: join("src", "data", "seeds"),
		},
	};

	knexInstance = knex(knexOptions);

	try {
		await knexInstance.raw("SELECT 1+1 AS result");
		await knexInstance.raw(`CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME}`);

		// We need to update the Knex configuration and reconnect to use the created database by default
		// USE ... would not work because a pool of connections is used
		await knexInstance.destroy();

		knexOptions.connection.database = DATABASE_NAME;
		knexInstance = knex(knexOptions);
		await knexInstance.raw("SELECT 1+1 AS result");
	} catch (error) {
		logger.error(error.message, { error });
		throw new Error("Could not initialize the data layer");
	}

	let migrationsFailed = true;
	try {
		await knexInstance.migrate.latest();
		migrationsFailed = false;
	} catch (error) {
		logger.error("Error while migrating the database", { error });
	}

	if (migrationsFailed) {
		try {
			await knexInstance.migrate.down();
		} catch (error) {
			logger.error("Error while undoing last migration", { error });
		}
		throw new Error("Migrations failed");
	}

	if (isDevelopment) {
		try {
			await knexInstance.seed.run();
		} catch (error) {
			logger.error("Error while seeding database", { error });
		}
	}

	logger.info("Succesfully connected to the databse");

	return knexInstance;
}

async function shutdownData() {
	const logger = getChildLogger("database");

	logger.info("Shutting down database connection");

	await knexInstance.destroy();
	knexInstance = null;

	logger.info("Database connection closed");
}

function getKnex() {
	if (!knexInstance)
		throw new Error(
			"please initialize the data layer before getting the knex instance"
		);
	return knexInstance;
}

const tables = Object.freeze({
	expense: "expenses",
	place: "places",
	category: "categories",
	user: "users",
	factsGent: "factsGent",
	quizGent: "quizGent"
});

module.exports = {
	initializeData,
	shutdownData,
	getKnex,
	tables,
};
