const Router = require("@koa/router");
const Role = require("../core/roles")
const userService = require("../service/user");
const { requireAuthentication, makeRequireRole } = require("../core/auth")

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

const register = async (ctx) => {
	const session = await userService.register(ctx.request.body);
	ctx.body = session;
};

const getAllUsers = async (ctx) => {
	ctx.body = await userService.getAll();
};

const createUser = async (ctx) => {
	const newUser = await userService.create(ctx.request.body);
	ctx.body = newUser;
	ctx.status = 201;
};

const getUserById = async (ctx) => {
	ctx.body = await userService.getUserById(ctx.params.id);
};

const updateUser = async (ctx) => {
	ctx.body = await userService.updateById(ctx.params.id, ctx.request.body);
};

const deleteUser = async (ctx) => {
	await userService.deleteById(ctx.params.id);

	ctx.status = 204;
};

module.exports = function installUserRoutes(app) {
	const router = new Router({
		prefix: "/users",
	});

	router.post("/login", login);
	router.post("/register", register);

	const requireAdmin = makeRequireRole(Role.ADMIN)

	router.get("/", requireAuthentication, requireAdmin, getAllUsers);
	router.post("/", requireAuthentication, createUser);
	router.get("/:id", requireAuthentication, getUserById);
	router.put("/:id", requireAuthentication, updateUser);
	router.delete("/:id", requireAuthentication, deleteUser);

	app.use(router.routes()).use(router.allowedMethods());
};
