const Router = require("@koa/router");
const expenseService = require("../service/expense");

const getAllExpenses = async (ctx) => {
	ctx.body = await expenseService.getAll();
};

const createExpense = async (ctx) => {
	const newexpense = await expenseService.create(ctx.request.body);
	ctx.body = newexpense;
	ctx.status = 201;
};

const getExpenseById = async (ctx) => {
	ctx.body = await expenseService.getexpenseById(ctx.params.id);
};

const updateExpense = async (ctx) => {
	ctx.body = await expenseService.updateById(ctx.params.id, ctx.request.body);
};

const deleteExpense = async (ctx) => {
	await expenseService.deleteById(ctx.params.id);

	ctx.status = 204;
};

module.exports = (app) => {
	const router = new Router({
		prefix: "/expenses",
	});

	router.get("/", getAllExpenses);
	router.post("/", createExpense);
	router.get("/:id", getExpenseById);
	router.put("/:id", updateExpense);
	router.delete("/:id", deleteExpense);

	app.use(router.routes()).use(router.allowedMethods());
};
