const Router = require("@koa/router");
const Role = require("../core/roles");
const userService = require("../service/user");
const { requireAuthentication, makeRequireRole } = require("../core/auth");
const Joi = require("joi");
const validate = require("./_validation");

/**
 * @swagger
 * tags:
 *  name: Users
 * description: Represents a user
 */

const login = async (ctx) => {
	const { email, password } = ctx.request.body;
	const session = await userService.login(email, password);
	ctx.body = session;
};
login.validationScheme = {
	body: {
		email: Joi.string().email(),
		password: Joi.string(),
	},
};

const register = async (ctx) => {
	const session = await userService.register(ctx.request.body);
	ctx.body = session;
};
register.validationScheme = {
	body: {
		name: Joi.string().max(255),
		surname: Joi.string().max(255),
		email: Joi.string().email(),
		phonenumber: Joi.string().max(255),
		password: Joi.string().min(8).max(30),
	},
};

const getAllUsers = async (ctx) => {
	ctx.body = await userService.getAll();
};
getAllUsers.validationScheme = {
	query: Joi.object({
		limit: Joi.number().integer().positive().max(1000).optional(),
		offset: Joi.number().min(0).optional(),
	}).and("limit", "offset"),
};

const createUser = async (ctx) => {
	const newUser = await userService.create(ctx.request.body);
	ctx.body = newUser;
	ctx.status = 201;
};
createUser.validationScheme = {
	body: {
		name: Joi.string().max(255),
		surname: Joi.string().max(255),
		email: Joi.string().email(),
		phonenumber: Joi.string().max(255),
		password: Joi.string().min(8).max(30),
	},
};

const getUserById = async (ctx) => {
	ctx.body = await userService.getUserById(ctx.params.id);
};
getUserById.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
};

const updateUser = async (ctx) => {
	ctx.body = await userService.updateById(ctx.params.id, ctx.request.body);
};

updateUser.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
	body: {
		name: Joi.string().max(255),
		surname: Joi.string().max(255),
		email: Joi.string().email(),
		phonenumber: Joi.string().max(255),
		password: Joi.string().min(8).max(30),
	},
};

const deleteUser = async (ctx) => {
	await userService.deleteById(ctx.params.id);

	ctx.status = 204;
};
deleteUser.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
};

module.exports = function installUserRoutes(app) {
	const router = new Router({
		prefix: "/users",
	});

	//public routes
	// validate(login.validationScheme),
	// validate(register.validationScheme),
	router.post("/login", validate(login.validationScheme), login);
	router.post("/register", validate(register.validationScheme), register);

	const requireAdmin = makeRequireRole(Role.ADMIN);

	router.get(
		"/",
		requireAuthentication,
		requireAdmin,
		validate(getAllUsers.validationScheme),
		getAllUsers
	);
	router.post(
		"/",
		requireAuthentication,
		validate(createUser.validationScheme),
		createUser
	);
	router.get(
		"/:id",
		requireAuthentication,
		validate(getUserById.validationScheme),
		getUserById
	);
	router.put(
		"/:id",
		requireAuthentication,
		validate(updateUser.validationScheme),
		updateUser
	);
	router.delete(
		"/:id",
		requireAuthentication,
		validate(deleteUser.validationScheme),
		deleteUser
	);

	app.use(router.routes()).use(router.allowedMethods());
};
