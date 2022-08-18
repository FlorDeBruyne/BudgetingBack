const Router = require("@koa/router");
const expenseService = require("../service/expense");
const Joi = require("joi");
const validate = require("./_validation");
const { requireAuthentication } = require("../core/auth");

const getAllExpenses = async (ctx) => {
	ctx.body = await expenseService.getAll();
};
getAllExpenses.validationScheme = {
	query: Joi.object({
		limit: Joi.number().integer().positive().max(1000).optional(),
		offset: Joi.number().min(0).optional(),
	}).and("limit", "offset"),
};

const createExpense = async (ctx) => {
	const newexpense = await expenseService.create(ctx.request.body);
	ctx.body = newexpense;
	ctx.status = 201;
};
createExpense.validationScheme = {
	body: {
		amount: Joi.number().invalid(0),
		name: Joi.string().max(255),
		categoryId: Joi.string().uuid(),
		date: Joi.date().iso().less("now"),
		placeId: Joi.string().uuid(),
	},
};

const getExpenseById = async (ctx) => {
	ctx.body = await expenseService.getById(ctx.params.id);
};
getExpenseById.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
};

const updateExpense = async (ctx) => {
	ctx.body = await expenseService.updateById(ctx.params.id, ctx.request.body);
};
updateExpense.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
	body: {
		amount: Joi.number().invalid(0),
		name: Joi.string().max(255),
		categoryId: Joi.string().uuid(),
		date: Joi.date().iso().less("now"),
		placeId: Joi.string().uuid(),
	},
};

const deleteExpense = async (ctx) => {
	await expenseService.deleteById(ctx.params.id);

	ctx.status = 204;
};
deleteExpense.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
};

module.exports = (app) => {
	const router = new Router({
		prefix: "/expenses",
	});

	router.get(
		"/",
		requireAuthentication,
		validate(getAllExpenses.validationScheme),
		getAllExpenses
	);
	router.post(
		"/",
		requireAuthentication,
		validate(createExpense.validationScheme),
		createExpense
	);
	router.get(
		"/:id",
		requireAuthentication,
		validate(getExpenseById.validationScheme),
		getExpenseById
	);
	router.put(
		"/:id",
		requireAuthentication,
		validate(updateExpense.validationScheme),
		updateExpense
	);
	router.delete(
		"/:id",
		requireAuthentication,
		validate(deleteExpense.validationScheme),
		deleteExpense
	);

	app.use(router.routes()).use(router.allowedMethods());
};
