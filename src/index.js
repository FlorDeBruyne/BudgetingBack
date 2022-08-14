const Koa = require("koa");
const koaCors = require("@koa/cors");
const config = require("config");
const bodyParser = require("koa-bodyparser");
const Router = require("@koa/router");
const { initializeData } = require("./data");
const createServer = require("./createServer");

const NODE_ENV = process.env.NODE_ENV; // config.get("env") doesn't work
const LOG_LEVEL = config.get("log.level");
const LOG_DISABLED = config.get("log.disabled");
const CORS_ORIGINS = config.get("cors.origins");
const CORS_MAX_AGE = config.get("cors.maxAge");

const app = new Koa();
const router = new Router();

async function main() {
	const server = createServer();
	await initializeData();

	app.use(bodyParser());
	app.use(
		koaCors({
			origin: (ctx) => {
				if (CORS_ORIGINS.indexOf(ctx.request.header.origin) !== -1) {
					return ctx.request.header.origin;
				}
				return CORS_ORIGINS[0];
			},
			allowHeaders: ["Accept", "content-Type", "Authorization"],
			maxAge: CORS_MAX_AGE,
		})
	);

	app.use(router.routes()).use(router.allowedMethods());

	app.listen(9000);
}

main();
