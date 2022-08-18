const Router = require("@koa/router");
const quizGentService = require("../service/quizGent");
const Joi = require("joi");
const validate = require("./_validation");
const { requireAuthentication } = require("../core/auth");

const getAllquizesGent = async (ctx) => {
	ctx.body = await quizGentService.getAll();
};
getAllquizesGent.validationScheme = {
	query: Joi.object({
		limit: Joi.number().integer().positive().max(1000).optional(),
		offset: Joi.number().min(0).optional(),
	}).and("limit", "offset"),
};

const createquizGent = async (ctx) => {
	const newquizGent = await quizGentService.create(ctx.request.body);
	ctx.body = newquizGent;
	ctx.status = 201;
};
createquizGent.validationScheme = {
	body: {
		vraag: Joi.string().max(500),
		antwoord: Joi.string().max(500),
	},
};

const getquizGentById = async (ctx) => {
	ctx.body = await quizGentService.getquizGentById(ctx.params.id);
};
getquizGentById.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
};

const updatequizGent = async (ctx) => {
	ctx.body = await quizGentService.updateById(ctx.params.id, ctx.request.body);
};
updatequizGent.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
	body: {
		vraag: Joi.string().max(500),
		antwoord: Joi.string().max(500),
	},
};

const deletequizGent = async (ctx) => {
	await quizGentService.deleteById(ctx.params.id);

	ctx.status = 204;
};
deletequizGent.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
};

module.exports = (app) => {
	const router = new Router({
		prefix: "/quizGent",
	});

	router.get(
		"/",
		// requireAuthentication,
		// validate(getAllquizesGent.validationScheme),
		getAllquizesGent
	);
	router.post(
		"/",
		requireAuthentication,
		validate(createquizGent.validationScheme),
		createquizGent
	);
	router.get(
		"/:id",
		requireAuthentication,
		validate(getquizGentById.validationScheme),
		getquizGentById
	);
	router.put(
		"/:id",
		requireAuthentication,
		validate(updatequizGent.validationScheme),
		updatequizGent
	);
	router.delete(
		"/:id",
		requireAuthentication,
		validate(deletequizGent.validationScheme),
		deletequizGent
	);

	app.use(router.routes()).use(router.allowedMethods());
};
