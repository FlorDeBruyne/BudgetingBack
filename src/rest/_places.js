const Router = require("@koa/router");
const placeService = require("../service/place");
const Joi = require("joi");
const validate = require("./_validation");
const { requireAuthentication } = require("../core/auth");
const { getAll } = require("../service/user");

const getAllPlaces = async (ctx) => {
	ctx.body = await placeService.getAll();
};
getAllPlaces.validationScheme = {
	query: Joi.object({
		limit: Joi.number().integer().positive().max(1000).optional(),
		offset: Joi.number().min(0).optional(),
	}).and("limit", "offset"),
};

const createPlace = async (ctx) => {
	const newPlace = await placeService.create(ctx.request.body);
	ctx.body = newPlace;
	ctx.status = 201;
};
createPlace.validationScheme = {
	body: {
		name: Joi.string().max(255),
	},
};

const getPlaceById = async (ctx) => {
	ctx.body = await placeService.getPlaceById(ctx.params.id);
};
getPlaceById.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
};

const updatePlace = async (ctx) => {
	ctx.body = await placeService.updateById(ctx.params.id, ctx.request.body);
};
updatePlace.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
	body: {
		name: Joi.string(),
	},
};

const deletePlace = async (ctx) => {
	await placeService.deleteById(ctx.params.id);

	ctx.status = 204;
};
deletePlace.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
};

module.exports = (app) => {
	const router = new Router({
		prefix: "/places",
	});

	router.get(
		"/",
		// requireAuthentication,
		// validate(getAllPlaces.validationScheme),
		getAllPlaces
	);
	router.post(
		"/",
		requireAuthentication,
		validate(createPlace.validationScheme),
		createPlace
	);
	router.get(
		"/:id",
		requireAuthentication,
		validate(getPlaceById.validationScheme),
		getPlaceById
	);
	router.put(
		"/:id",
		requireAuthentication,
		validate(updatePlace.validationScheme),
		updatePlace
	);
	router.delete(
		"/:id",
		requireAuthentication,
		validate(deletePlace.validationScheme),
		deletePlace
	);

	app.use(router.routes()).use(router.allowedMethods());
};
