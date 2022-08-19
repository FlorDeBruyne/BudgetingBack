const Koa = require("Koa");
const config = require("config");
const koaCors = require("@koa/cors");
const bodyParser = require("koa-bodyparser");
const { initializeLogger, getLogger } = require("./core/logger");
const { initializeData, shutdownData } = require("./data");
const installRest = require("./rest");
const { serializeError } = require("serialize-error");
const ServiceError = require("./core/serviceError");

const swaggerJsdoc = require("swagger-jsdoc");
const { koaSwagger } = require("koa2-swagger-ui");
const swaggerOptions = require("../swagger.config");

const NODE_ENV = process.env.NODE_ENV; // doesn't work  config.get("env")
const CORS_ORIGINS = "http://localhost:3000"; //config.get("cors.origins");
const CORS_MAX_AGE = 3 * 60 * 60; //config.get("cors.maxAge");
const LOG_LEVEL = "silly"; //config.get("log.level");
// const LOG_DISABLED = config.get("log.disabled");

module.exports = async function createServer() {
	initializeLogger({
		level: LOG_LEVEL,
		// disabled: LOG_DISABLED,
		// isProduction: NODE_ENV === "production",
		name: "creatingServer",
	});

	await initializeData();

	const app = new Koa();

	// Add CORS
	app.use(
		koaCors({
			origin: (ctx) => {
				if (CORS_ORIGINS.indexOf(ctx.request.header.origin) !== -1) {
					return ctx.request.header.origin;
				}
				// Not a valid domain at this point, let's return the first valid as we should return a string
				return CORS_ORIGINS[0];
			},
			allowHeaders: ["Accept", "Content-Type", "Authorization"],
			maxAge: CORS_MAX_AGE,
		})
	);

	const logger = getLogger();

	app.use(bodyParser());

	// const spec = swaggerJsdoc(swaggerOptions);

	// app.use(
	// 	koaSwagger({
	// 		routePrefix: "/swagger",
	// 		specPrefix: "/swagger/spec",
	// 		exposeSpec: true,
	// 		swaggerOptions: {
	// 			spec,
	// 		},
	// 	})
	// );

	app.use(async (ctx, next) => {
		logger.info(`${ctx.method} ${ctx.url}`);

		const getStatusMessage = () => {
			if (ctx.status >= 500) return "Dead";
			if (ctx.status >= 400) return "bruv";
			if (ctx.status >= 300) return "Flying";
			if (ctx.status >= 200) return "Working";
			return "Rewind";
		};

		try {
			await next();
			logger.info(
				`${getStatusMessage()} ${ctx.method} ${ctx.status} ${ctx.url}`
			);
		} catch (error) {
			logger.error(
				`${getStatusMessage()} ${ctx.method} ${ctx.status} ${
					(ctx.url, { error })
				}` //
			);
			throw error;
		}
	});

	app.use(async (ctx, next) => {
		try {
			await next();

			if (ctx.status === 404) {
				ctx.body = {
					code: "NOT_FOUND",
					message: `Unknown resource: ${ctx.url}`,
				};
			}
		} catch (error) {
			logger.info(ctx.body);
			logger.error("Error occured while handling a request", {
				error: serializeError(error),
			});
		}

		let statusCode = error.status || 500;
		let errorBody = {
			code: error.code || "INTERNAL_SERVER_ERROR",
			message: error.message,
			details: error.details || {},
			stack: NODE_ENV !== "production" ? error.stack : undefined,
		};

		if (error instanceof ServiceError) {
			if (error.isNotFound) {
				statusCode = 404;
			}

			if (error.isValidationFailed) {
				statusCode = 400;
			}

			if (error.isUnauthorized) {
				statusCode = 401;
			}

			if (error.isForbidden) {
				statusCode = 403;
			}
		}

		ctx.status = statusCode;
		ctx.body = errorBody;
	});

	installRest(app);

	return {
		getApp() {
			return app;
		},

		start() {
			return new Promise((resolve) => {
				const port = process.env.PORT || 9000;
				app.listen(port);
				logger.info(`🚀 Server listening on http://localhost:${port}`);
				resolve();
			});
		},

		async stop() {
			{
				app.removeAllListeners();
				await shutdownData();
				logger.info("Goodbye");
			}
		},
	};
};
