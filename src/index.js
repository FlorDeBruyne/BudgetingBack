const Koa = require("koa");
const koaCors = require("@koa/cors");
const config = require("config");
const getConsoleLogger = require("get-logger/lib/getConsoleLogger");
const bodyParser = require("koa-bodyparser");
const Router = require("@koa/router");
const ExpenseService = require("./service/expense");
const { initializeData } = require("./data");

const NODE_ENV = process.env.NODE_ENV; // config.get("env") doesn't work
const LOG_LEVEL = config.get("log.level");
const LOG_DISABLED = config.get("log.disabled");
const CORS_ORIGINS = config.get("cors.origins");
const CORS_MAX_AGE = config.get("cors.maxAge");

const app = new Koa();
const logger = getConsoleLogger();
const router = new Router();

async function main() {
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

	router.get("/api/expenses", async (ctx) => {
		ctx.body = ExpenseService.getAll();
	});

	router.get("/api/expenses/:id", async (ctx) => {
		const id = ctx.params.id;
		ctx.body = ExpenseService.getById(id);
	});

	router.post("/api/expenses", async (ctx) => {
		newExpense = ExpenseService.create({
			...ctx.request.body,
			date: new Date(ctx.request.date),
		});
		ctx.boyd = newExpense;
	});

	router.put("/api/expenses/:id", async (ctx) => {
		updatedExpense = ExpenseService.updateById(ctx.params.id, ctx.request.body);
		return updatedExpense;
	});

	router.delete("/api/expenses/:id", async (ctx) => {
		removedExpense = ExpenseService.deleteById(ctx.params.id);
		return removedExpense;
	});

	app.use(router.routes()).use(router.allowedMethods());

	app.listen(9000);
}

main();
