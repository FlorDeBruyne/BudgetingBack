const Router = require("@koa/router");
const factsGentService = require("../service/factsGent");
const Joi = require("joi");
const validate = require("./_validation");
const { requireAuthentication } = require("../core/auth");

const getAllFactsGent = async (ctx) => {
	ctx.body = await factsGentService.getAll();
};
getAllFactsGent.validationScheme = {
	query: Joi.object({
		limit: Joi.number().integer().positive().max(1000).optional(),
		offset: Joi.number().min(0).optional(),
	}).and("limit", "offset"),
};

const createFactsGent = async (ctx) => {
	const newFactsGent = await factsGentService.create(ctx.request.body);
	ctx.body = newFactsGent;
	ctx.status = 201;
};
createFactsGent.validationScheme = {
	body: {
		title: Joi.string().max(500),
		factText: Joi.string().max(500),
	},
};

const getFactsGentById = async (ctx) => {
	ctx.body = await factsGentService.getFactsGentById(ctx.params.id);
};
getFactsGentById.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
};

const updateFactsGent = async (ctx) => {
	ctx.body = await factsGentService.updateById(ctx.params.id, ctx.request.body);
};
updateFactsGent.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
	body: {
		title: Joi.string().max(500),
		factText: Joi.string().max(500),
	},
};

const deleteFactsGent = async (ctx) => {
	await factsGentService.deleteById(ctx.params.id);

	ctx.status = 204;
};
deleteFactsGent.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
};

module.exports = (app) => {
	const router = new Router({
		prefix: "/FactsGent",
	});

	router.get(
		"/",
		// requireAuthentication,
		// validate(getAllFactsGent.validationScheme),
		getAllFactsGent
	);
	router.post(
		"/",
		requireAuthentication,
		validate(createFactsGent.validationScheme),
		createFactsGent
	);
	router.get(
		"/:id",
		requireAuthentication,
		validate(getFactsGentById.validationScheme),
		getFactsGentById
	);
	router.put(
		"/:id",
		requireAuthentication,
		validate(updateFactsGent.validationScheme),
		updateFactsGent
	);
	router.delete(
		"/:id",
		requireAuthentication,
		validate(deleteFactsGent.validationScheme),
		deleteFactsGent
	);

	app.use(router.routes()).use(router.allowedMethods());
};
